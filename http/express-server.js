const express = require('express');
const app = express();
var hbs = require('hbs');


app.set('view engine', 'hbs');


app.get("/", (req, resp) => {

    //resp.send("<h2>Node Express Application</h2>");
    resp.render('home', {
        message: "Hello Node"
    });
})
app.get("/about", (req, resp) => {

    //resp.send("<h2>About</h2>");
    resp.render('about', {

    });
})


app.listen(7000, () => {
    console.log("Express server running at 7000");
})


