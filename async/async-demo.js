


console.log("App started");


setTimeout(function(){
    console.log("timeout after 3 sec")
}, 3000);

setTimeout(function(){
    console.log("timeout after 0 sec")
}, 0);

setImmediate(() => {
    console.log("immediate...");
});
process.nextTick(() => {
    console.log("process nextTick")
})

console.log("App Completed");
