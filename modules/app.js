console.log("in app.js");

const math =require('./math');
//const math =require('./math');
//const math =require('./math');

//const math =require('./test/math'); modules/test/math
//const math =require('../../math');

console.log(math);
console.log("add: ", math.sum(4, 9));

console.log("filename", __filename);
console.log("dirname", __dirname);

const os = require('os');
console.log("No of cpus: ", os.cpus().length);
console.log("OS Arch: ", os.arch());


const util = require('./util');
console.log("util", util);

const mylib = require('./mylib');
console.log("mylib", mylib);

const chalk = require('chalk');
console.log(chalk.green.inverse("Success"));

console.log(module);

