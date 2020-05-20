"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_json_1 = __importDefault(require("./data.json"));
const fs_1 = __importDefault(require("fs"));
//console.log(data);
console.log(data_json_1.default.webchat.buttons.button);
//console.log(data.webchat.buttons.button[0]);
data_json_1.default.webchat.buttons.button = [
    {
        value: 'Paying ',
        text: 'Paying ',
        classname: 'btn-test'
    }
];
//data.webchat.buttons.button[0].text = "Hello World";
//console.log("After ..........");
// console.log(data);
fs_1.default.writeFile("result.json", JSON.stringify(data_json_1.default), (err) => {
    if (!err) {
        console.log('saved');
    }
});
