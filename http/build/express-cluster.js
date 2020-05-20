"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const cpus = os_1.default.cpus().length;
console.log("In cluster...");
if (cluster_1.default.isMaster) {
    console.log("In cluster master");
    for (let i = 0; i < cpus; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on("exit", (worker) => {
        console.log(`Worker crashed: ${worker.id}`);
        cluster_1.default.fork();
    });
}
else {
    console.log("Forking a new instance");
    require('./express-rest-server');
}
