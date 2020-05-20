"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const child_process_1 = __importDefault(require("child_process"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const authController = __importStar(require("./controller/AuthController"));
const mongodb_1 = __importDefault(require("mongodb"));
//express (http: 9000)
const app = express_1.default();
//web server
const server = http_1.default.createServer(app);
//web socket (9000)
const io = socket_io_1.default(server);
const PORT = 9000;
const mongoClient = mongodb_1.default.MongoClient;
var allSockets = [];
io.on("connection", (socket) => {
    allSockets.push(socket);
    console.log("Client connected...");
    socket.emit("data", "Some data...");
});
let products;
function loadData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mongoUrl = "mongodb://localhost";
            const client = yield mongoClient.connect(mongoUrl, { useUnifiedTopology: true });
            yield client.connect();
            const collection = yield client.db('productsdb').collection('products');
            const results = yield collection.find({}).toArray();
            return results;
        }
        catch (error) {
            console.log("error", error);
            return [];
        }
    });
}
function saveProduct(product) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mongoUrl = "mongodb://localhost";
            const client = yield mongoClient.connect(mongoUrl, { useUnifiedTopology: true });
            yield client.connect();
            const collection = yield client.db('productsdb').collection('products');
            collection.save(product, (err, result) => {
                if (err) {
                    throw err;
                }
                return result.result;
            });
        }
        catch (error) {
            console.log("error", error);
            throw error;
        }
    });
}
//Middleware(intercepts the request==> preprocessing)
app.use((req, resp, next) => {
    console.log(`In middleware ${req.originalUrl} , process id: ${process.pid}`);
    next();
});
//Enable CORS
app.use(cors_1.default());
// app.use((req, resp, next) => {
//     resp.setHeader("Access-Control-Allow-Origin", "*");
//     resp.setHeader("Access-Control-Allow-Methods", "*");
//     resp.setHeader("Access-Control-Allow-Headers", "*");
//     next();
// })
app.use(body_parser_1.default.json());
//app.use("/products", authController.authorizeProducts);
app.post("/login", authController.loginAction);
app.get("/products", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield loadData();
        resp.json(products);
    }
    catch (error) {
        resp.sendStatus(500);
    }
}));
app.get("/products/:id", (req, resp) => {
    //Product exist ==> product status: 200(OK)
    // No product ==> null status: 404(Not Found)
    const id = req.params.id;
    const product = products.find(item => item.id === parseInt(id));
    if (product) {
        resp.json(product);
    }
    else {
        resp.status(404).send("Product not Found");
    }
});
//create a new product
app.post("/products", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate the product ==> not valid ==> status: 400(Bad request)
    // Valid product ==> update the data-store => status: 201(Created)
    // Error is saving ==> status: 500(ISR)
    try {
        const product = req.body;
        //const index = products.findIndex(item => item.id === product.id);
        yield saveProduct(product);
        allSockets.forEach(socket => {
            socket.emit("product", product);
        });
        resp.sendStatus(200);
    }
    catch (error) {
        //error
        console.log(error);
        resp.status(500).send();
    }
}));
app.delete("/products/:id", (req, resp) => {
    //id exists ==> remove status: 200
    // not exist  ==>  status: 404
    // error ==> 500
    const id = req.params.id;
    try {
        const index = products.findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            products.splice(index, 1);
            resp.status(200).send();
        }
        else {
            resp.status(404).send();
        }
    }
    catch (error) {
        resp.status(500).send();
    }
});
app.put("/products", (req, resp) => {
    // product not found == 404
    // is found and valid ==> update ==> 200
    // invalid ==> 400
    // error ==> 500
    try {
        const product = req.body;
        const index = products.findIndex(item => item.id === product.id);
        if (index !== -1) {
            products[index] = product;
            resp.status(200).send();
        }
        else {
            resp.status(404).send();
        }
    }
    catch (error) {
        resp.status(500).send();
    }
});
app.get("/task", (req, resp) => {
    //resp.send("Hello");
    // setTimeout(() => {
    //     resp.send("Hello Again");
    // }, 2000);
    const cProcess = child_process_1.default.fork(__dirname + '/child/compute');
    //receiving message send by the child process
    cProcess.on("message", (data) => {
        resp.json({ data: data });
    });
    //send message back to the child process
    cProcess.send("hello");
});
app.get("/crash", () => {
    process.exit();
});
server.listen(PORT, () => {
    console.log(`REST API running on port ${PORT} with process id: ${process.pid}`);
});
