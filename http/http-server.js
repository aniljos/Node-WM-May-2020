const http = require('http');

const server = http.createServer();


server.on('request', (req, resp)=> {

    console.log("Http request received");
    resp.writeHead(200, {"Content-Type":  "text/html"});
    resp.write("<h2>Node Http Server</h2>");
    resp.end();

})

server.listen(7000, () => {
    console.log("Http server started at port: 7000")
});