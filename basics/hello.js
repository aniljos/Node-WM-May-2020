console.log("Hello NodeJS");


// var console = new Console()
global.console.log("testing the global object");

var x = 10; // module 
console.log("x: ", x);
//console.log("x: ", global.x);

y = 100; // global.y = 100;
console.log("y: ", y);
console.log("y: ", global.y);

console.log("process.id", process.pid);

