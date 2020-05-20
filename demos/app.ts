import data from './data.json';
import fs from 'fs';


//console.log(data);
console.log(data.webchat.buttons.button);
//console.log(data.webchat.buttons.button[0]);

data.webchat.buttons.button = [
    {
        value: 'Paying ',
        text: 'Paying ',
        classname: 'btn-test'
      }
]
//data.webchat.buttons.button[0].text = "Hello World";

//console.log("After ..........");

// console.log(data);

fs.writeFile("result.json", JSON.stringify(data),(err) => {
    if(!err){
        console.log('saved');
    }
});
