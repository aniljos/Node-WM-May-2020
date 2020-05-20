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

//express (http: 9000)
const app = express();
//web server
const server = http.createServer(app);
//web socket (9000)
const io = socketIO(server);

const PORT = 9000;


var allSockets: Array<socketIO.Socket> = [];
io.on("connection", (socket) => {

    allSockets.push(socket);
    console.log("Client connected...");
    socket.emit("data", "Some data...");
})



let products: Array<Product>;

function load(){
    products = new Array<Product>();
    products.push(new Product(1, "IPhone 11", 80000, "Mobiles"));
    products.push(new Product(2, "Dell Inspiron", 6000, "Laptops"));
    products.push(new Product(3, "Xbox One", 35000, "Gaming"));
}
load();

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


app.get("/products", (req, resp) => {

    resp.json(products);
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
app.post("/products", (req, resp) => {

    // Validate the product ==> not valid ==> status: 400(Bad request)
    // Valid product ==> update the data-store => status: 201(Created)
    // Error is saving ==> status: 500(ISR)

    try {

        const product = req.body;
        const index = products.findIndex(item => item.id === product.id);
        if(index === -1){

            products.push(product);
            const productUrl = url.format({
                protocol: req.protocol,
                host: req.hostname,
                pathname: req.originalUrl + "/" + product.id
            });

            allSockets.forEach(socket => {
                socket.emit("product", product);
            })


            resp.status(201).setHeader("location", productUrl);
            resp.end();

        }
        else{

            //No Valid
            resp.status(400).send();
        }


    } catch (error) {
        //error
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

