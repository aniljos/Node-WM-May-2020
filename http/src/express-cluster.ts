import cluster from 'cluster';
import os from 'os';

const cpus = os.cpus().length;

console.log("In cluster...");

if(cluster.isMaster){

    console.log("In cluster master");
    for (let i = 0; i < cpus; i++) {

        cluster.fork();        
    
    }
    cluster.on("error", (worker)=> {

        console.log(`Worker crashed: ${worker.id}`);
        cluster.fork();

    })
}
else{

    console.log("Forking a new instance");
    require('./express-rest-server');
}

