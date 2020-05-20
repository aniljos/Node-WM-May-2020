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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const url_1 = __importDefault(require("url"));
const product_1 = require("./model/product");
const child_process_1 = __importDefault(require("child_process"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const authController = __importStar(require("./controller/AuthController"));
//express (http: 9000)
const app = express_1.default();
//web server
const server = http_1.default.createServer(app);
//web socket (9000)
const io = socket_io_1.default(server);
const PORT = 9000;
var allSockets = [];
io.on("connection", (socket) => {
    allSockets.push(socket);
    console.log("Client connected...");
    socket.emit("data", "Some data...");
});
let products;
function load() {
    products = new Array();
    products.push(new product_1.Product(1, "IPhone 11", 80000, "Mobiles"));
    products.push(new product_1.Product(2, "Dell Inspiron", 6000, "Laptops"));
    products.push(new product_1.Product(3, "Xbox One", 35000, "Gaming"));
}
load();
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
app.get("/products", (req, resp) => {
    resp.json(products);
});
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
app.post("/products", (req, resp) => {
    // Validate the product ==> not valid ==> status: 400(Bad request)
    // Valid product ==> update the data-store => status: 201(Created)
    // Error is saving ==> status: 500(ISR)
    try {
        const product = req.body;
        const index = products.findIndex(item => item.id === product.id);
        if (index === -1) {
            products.push(product);
            const productUrl = url_1.default.format({
                protocol: req.protocol,
                host: req.hostname,
                pathname: req.originalUrl + "/" + product.id
            });
            allSockets.forEach(socket => {
                socket.emit("product", product);
            });
            resp.status(201).setHeader("location", productUrl);
            resp.end();
        }
        else {
            //No Valid
            resp.status(400).send();
        }
    }
    catch (error) {
        //error
        resp.status(500).send();
    }
});
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
