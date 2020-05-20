
function compute(){
    let sum = 0
    for (let i = 0; i < 1e10; i++) {
        
        sum += i;
    }
    return sum;
}

///receiving the messsage
process.on("message", (data) => {

    console.log(`Started child process id: ${process.pid}`)
    const sum = compute();
    if(process.send)
    {
        //send message back to the parent process
        process.send(sum);
        process.exit();
    }
    
})