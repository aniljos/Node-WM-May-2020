import express from 'express';
import bodyParser from 'body-parser';
import url from 'url';

import { Product } from './model/product';
import { setTimeout } from 'timers';
import childProcess from 'child_process';
import socketIO from 'socket.io';

import http from 'http';
import cors from 'cors';
import * as authController from './controller/AuthController';
import mongodb from 'mongodb';

//express (http: 9000)
const app = express();
//web server
const server = http.createServer(app);
//web socket (9000)
const io = socketIO(server);

const PORT = 9000;

const mongoClient = mongodb.MongoClient;





var allSockets: Array<socketIO.Socket> = [];
io.on("connection", (socket) => {

    allSockets.push(socket);
    console.log("Client connected...");
    socket.emit("data", "Some data...");
})



let products: Array<Product>;

async function loadData() {

    try {
        const mongoUrl = "mongodb://localhost";
        const client = await mongoClient.connect(mongoUrl, { useUnifiedTopology: true });
        await client.connect();
        const collection =  await client.db('productsdb').collection('products');
        const results =  await collection.find({}).toArray();
        return results;
    } catch (error) {
        
        console.log("error", error);
        return [];
    }
    
}
async function saveProduct(product: Product) {

    try {
        
        const mongoUrl = "mongodb://localhost";
        const client = await mongoClient.connect(mongoUrl, { useUnifiedTopology: true });
        await client.connect();
        const collection =  await client.db('productsdb').collection('products');
        collection.save(product, (err, result) => {
            if(err){
                throw err;
            }
            return result.result;
        })
        
    } catch (error) {
        
        console.log("error", error);
        throw error;
    }
    
}

//Middleware(intercepts the request==> preprocessing)
app.use((req, resp, next) => {

    console.log(`In middleware ${req.originalUrl} , process id: ${process.pid}`);
    next();
});
//Enable CORS

app.use(cors());

// app.use((req, resp, next) => {

//     resp.setHeader("Access-Control-Allow-Origin", "*");
//     resp.setHeader("Access-Control-Allow-Methods", "*");
//     resp.setHeader("Access-Control-Allow-Headers", "*");

//     next();
// })

app.use(bodyParser.json());

//app.use("/products", authController.authorizeProducts);

app.post("/login", authController.loginAction);


app.get("/products", async (req, resp) => {

    try {
        const products = await loadData()
        resp.json(products);

    } catch (error) {
        resp.sendStatus(500);
    }
});
app.get("/products/:id", (req, resp)=> {

    //Product exist ==> product status: 200(OK)
    // No product ==> null status: 404(Not Found)

    const id = req.params.id;
    const product = products.find(item => item.id === parseInt(id));
    if(product){
        resp.json(product);
    }
    else{
        resp.status(404).send("Product not Found");
    }
})

//create a new product
app.post("/products", async (req, resp) => {

    // Validate the product ==> not valid ==> status: 400(Bad request)
    // Valid product ==> update the data-store => status: 201(Created)
    // Error is saving ==> status: 500(ISR)

    try {

        const product = req.body;
        //const index = products.findIndex(item => item.id === product.id);
        await saveProduct(product);
        allSockets.forEach(socket => {
            socket.emit("product", product);
        })
        resp.sendStatus(200);

    } catch (error) {
        //error
        console.log(error);
        resp.status(500).send();
    }
})

app.delete("/products/:id", (req, resp) => {

    //id exists ==> remove status: 200
    // not exist  ==>  status: 404
    // error ==> 500

    const id = req.params.id;
    try {
        
        const index = products.findIndex(item => item.id === parseInt(id))
        if(index !== -1){
            products.splice(index, 1);
            resp.status(200).send();
        }
        else{
            resp.status(404).send();
        }
    } catch (error) {
        resp.status(500).send();
    }

});

app.put("/products", (req, resp)=> {

    // product not found == 404
    // is found and valid ==> update ==> 200
    // invalid ==> 400
    // error ==> 500

    try {
        const product = req.body;        
        const index = products.findIndex(item => item.id === product.id)
        if(index !== -1){
            products[index] = product;
            resp.status(200).send();
        }
        else{
            resp.status(404).send();
        }


    } catch (error) {
        resp.status(500).send();
    }
})

app.get("/task", (req, resp) => {


    //resp.send("Hello");
    // setTimeout(() => {
    //     resp.send("Hello Again");

    // }, 2000);
    
    const cProcess = childProcess.fork(__dirname + '/child/compute');

    //receiving message send by the child process
    cProcess.on("message", (data) => {
        resp.json({data: data});
    })

    //send message back to the child process
    cProcess.send("hello");

    

})

app.get("/crash", () => {

    process.exit();
})


server.listen(PORT, () => {
    console.log(`REST API running on port ${PORT} with process id: ${process.pid}`);
});

