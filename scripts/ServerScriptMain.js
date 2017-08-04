"use strict";

import ServerStarter from "./ServerStarter.js";
import SocketManager from "./SocketManager.js";

class ServerScriptMain{
    constructor(){
        const serverStarterObj = new ServerStarter();
        const webSocketServer = serverStarterObj.createServer();
        this.socketManager = new SocketManager(webSocketServer);
    }
}

const mainObj = new ServerScriptMain();
