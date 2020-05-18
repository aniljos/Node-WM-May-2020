console.log("in math.js");


function add(x, y) {
    return x + y;
}

// Method One
// exports.sum = add;
// exports.x = 100;
// exports.msg = "Hello";

//Method Two
module.exports = {
    sum: add,
    x: 100,
    mag: "Hello"
};







//internally
// (function (exports, require, modules, __filename, __dirname) {

//     console.log("in math.js");

//     //function scope
//     function add(x, y) {
//         return x + y;
//     }

// })();