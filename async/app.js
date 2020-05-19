const fs = require('fs');
const EventEmitter = require('events');

// const user = {id: 100, name: "Anil"};
// const data = JSON.stringify(user);

// fs.writeFile('data.json', data, (err) => {

//     if(err){
//         console.log("failed to write")
//         return;
//     }
//     console.log("saved");
// });

//callback
function writeToFile(data, fileName, successCb, errorCb){

    fs.writeFile(fileName, data, (err) => {

        if(err){
            errorCb(err)
            return;
        }
        successCb();
    });
}

// writeToFile({name: "Anil", location: "Mumbai"}, "user.json", () => {
//     console.log("success")
// }, () => {
//     console.log("error");
// });

//promise
function readFile(fileName){

    return new Promise((resolve, reject) => {

        fs.readFile(fileName, (err, data)=> {

            if(err){
                reject(err);
                return;
            }
            resolve(JSON.parse(data));
        });

    })
}
// var promise = readFile("data.json");
// promise.then((data) => {
//     console.log("resolved: ", data);
// }, (err) =>{
//     console.log("err", err);
// })


class FileIOEvents extends EventEmitter{
}
class FileIO{

    constructor(){
        this.events = new FileIOEvents();
    }

    readFile(fileName){

        fs.readFile(fileName, (err, data) => {

            if(err){
               
                this.events.emit('error', err);
                return;
            }
            this.events.emit('success', JSON.parse(data));
        })
    }

}
const fileIO = new FileIO();
fileIO.events.on('error', (err) => {
    console.log("error", err);
});
fileIO.events.on("success", (data) => {
    console.log("success", data);
});

fileIO.readFile("data.json");