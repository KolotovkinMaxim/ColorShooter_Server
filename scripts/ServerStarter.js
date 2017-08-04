"use strict";

export default class ServerStarter{
    constructor(){
        console.log("\n__________________________");
    }

    createServer(){
        let webSocketServer = null;
        console.log("Node JS Server");
        eval(" let WebSocketServer = new require('ws'); let portNumber = process.env.PORT || 5000; webSocketServer = new WebSocketServer.Server({ port: portNumber });  console.log('Server works OK on port ' + portNumber); ");
        console.log("__________________________\n");
        return webSocketServer;
    }
};
