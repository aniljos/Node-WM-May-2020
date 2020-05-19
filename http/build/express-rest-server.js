"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = require("./model/product");
const app = express_1.default();
const PORT = 9000;
let products;
function load() {
    products = new Array();
    products.push(new product_1.Product(1, "IPhone 11", 80000, "Mobiles"));
    products.push(new product_1.Product(2, "Dell Inspiron", 6000, "Laptops"));
    products.push(new product_1.Product(3, "Xbox One", 35000, "Gaming"));
}
load();
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
app.listen(PORT, () => {
    console.log(`REST API running on port ${PORT}`);
});
