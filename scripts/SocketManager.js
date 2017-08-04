"use strict";

import Room from "./Room.js";

export default class SocketManager{
    constructor(webSocketServer){
        this.clients = {};
        this.nameCounter = 1;
        this.logins = {};

        this.rooms = [];

        this.webSocketServer = webSocketServer;
        this.addAllSocketEvents();
    }

    isIdInClients(id){
        for (let key in this.clients) {
           if(id === key){
               return true;
           }
        }
        return false;
    }

    getStringWithListOfRooms(){
        let mass = [];
        for(let i = 0; i < this.rooms.length; i++){
            const room = this.rooms[i];
            const id = room.player_1.id;
            if(this.isIdInClients(id) === true){
                if(this.isIdInLogins(id) === true){
                    const login = this.logins[id];
                    mass.push(login.toString());
                }
            }
        }
        const answer = mass.join("!");
        return answer;
    }

    isIdInLogins(id){
        for (let key in this.logins) {
            if(id === key){
                return true;
            }
        }
        return false;
    }

    sendMessage(id, message){
        try {
            if (this.clients[id] !== undefined && this.clients[id] !== null) {
                if (this.isIdInClients(id) === true) {
                    this.clients[id].send(message.toString());
                    if (message !== "ANSWER_RUBBISH") {
                        console.log("Отправить пользователю " + id + " сообщение: " + message);
                    }
                }
            }
        } catch (err) {
            console.log("I catched error is function sendMessage");
        }
    }

    sendToAll(message){
        message = message.toString();
        for(let key in this.clients){
            const id = key;
            try {
                if (this.clients[id] !== undefined && this.clients[id] !== null) {
                    if (this.isIdInClients(id) === true) {
                        this.clients[id].send(message);
                        if (message !== "ANSWER_RUBBISH") {
                            console.log("Отправить пользователю " + id + " сообщение: " + message);
                        }
                    }
                }
            } catch (err) {
                console.log("I catched error is function sendToAll");
            }
        }
    }

    deleteUser(id){
        if(this.isIdInClients(id) === true){
            delete this.clients[id];
        }
        if(this.isIdInLogins(id) === true){
            delete this.logins[id];
        }
        console.log("Пользователь " + id + " удалён");
    }

    printClientsAndLogins(){
        console.log("\n");
        console.log("Clients and logins:");
        for(let key in this.clients){
            const id = key;
            if(this.isIdInClients(id) === true && this.isIdInLogins(id) === true){
                console.log(id + "  _______  " + this.logins[id]);
            }
        }
        console.log("\n");
    }

    printRooms(){
        const t = this;
        console.log("\n");
        console.log("List of Rooms:");
        for(let i = 0; i < this.rooms.length; i++){
            const room = t.rooms[i];
            console.log("комната игрока: _ _ _ _ _ " + room.player_1.id + " _ _ _" + room.player_1.login);
        }
        console.log("\n");
    }

    getArrayInfo(message){
        message = message.toString();
        let mass = [];
        mass = message.split("@");
        for(let i = 0; i < mass.length; i++){
            mass[i] = mass[i].toString();
        }
        return mass;
    }

    addAllSocketEvents(){
        const t = this;

        this.webSocketServer.on("connection", function(ws) {

            const id = "id_" + t.nameCounter;
            t.nameCounter += 1;
            t.clients[id] = ws;
            console.log("New client connected: " + id);
            t.sendMessage(id,"YOUR_ARE@" + id);

            t.sendToAll("ROOMSLIST@" + t.getStringWithListOfRooms());


            ws.on("message", function(message) {
                const mass = t.getArrayInfo(message);
                const type = mass[0];

                if(type !== "RUBBISH") {
                    console.log("получено сообщение:  " + message);
                }

                if(type === "SET_LOGIN"){
                    const login = mass[1];
                    t.logins[id] = login;
                    t.printClientsAndLogins();
                    t.sendMessage(id,"LOGIN_WAS_GET_OK______what_do_you_want");
                    t.sendToAll("ROOMSLIST@" + t.getStringWithListOfRooms());
                }

                if(type === "RUBBISH"){
                    t.sendMessage(id,"ANSWER_RUBBISH");
                }

                if(type === "CREATEROOM"){
                    const room = new Room();
                    const playerLogin = mass[1].toString();
                    const playerId = id;
                    room.addPlayer(playerId,playerLogin);
                    t.rooms.push(room);
                    t.sendMessage(id,"ROOM_IS_CREATED_OK");
                    t.sendToAll("NEW_ROOM@" + t.logins[id].toString());
                    t.printRooms();
                    t.sendToAll("ROOMSLIST@" + t.getStringWithListOfRooms());

                    room.initClientsArray(t.clients);
                }

                if(type === "WANT_TO_JOIN"){
                    const loginOfRoomHaver = mass[1].toString();

                    const id_user = id;
                    const login_user = t.logins[id_user];

                    for(let i = 0; i < t.rooms.length; i++){
                        const room = t.rooms[i];

                        if(room.player_1.login === loginOfRoomHaver){
                            if(room.getNumber() !== 4){
                                room.addPlayer(id_user, login_user);

                                const id_1 = room.player_1.id;
                                const id_2 = room.player_2.id;
                                const id_3 = room.player_3.id;

                                const login_1 = room.player_1.login;
                                const login_2 = room.player_2.login;
                                const login_3 = room.player_3.login;

                                const infoMessage = "ROOM_PLAYERS@" + login_1 + "@" + login_2 + "@" + login_3;

                                t.sendMessage(id_1,infoMessage);
                                t.sendMessage(id_2,infoMessage);
                                t.sendMessage(id_3,infoMessage);

                                if(room.getNumber() === 4){
                                    t.sendMessage(id_1,"START_GAME");
                                    t.sendMessage(id_2,"START_GAME");
                                    t.sendMessage(id_3,"START_GAME");
                                }

                            } else {
                                t.sendMessage(id,"NO_FREE_PLACES_IN_ROOM");
                            }
                        }
                    }
                }

                if(type === "KEY"){
                    const keyType = mass[1];
                    const operationType = mass[2];

                    for(let i = 0; i < t.rooms.length; i++){
                        const room = t.rooms[i];
                        if(room.isIdInRoom(id) === true){
                            const playerType = room.getTypeOfPlayer(id);
                            room.setAction(playerType, keyType, operationType);
                            break;
                        }
                    }
                }

            });


            ws.on("close", function() {
                for(let i = 0; i < t.rooms.length; i++){
                    const room = t.rooms[i];

                    if(room.gameStarted === true){
                        const loginOfDeletedUser = t.logins[id].toString();
                        t.deleteUser(id);
                        t.sendMessage(room.player_1.id,"GAME_FINISHED");
                        t.sendMessage(room.player_2.id,"GAME_FINISHED");
                        t.sendMessage(room.player_3.id,"GAME_FINISHED");
                        t.sendToAll("DELETED_ROOM@" + loginOfDeletedUser);

                        room.deleteAllIntervals();
                        t.rooms.splice(i,1);

                        t.printRooms();
                        t.deleteUser(id);
                        t.printClientsAndLogins();
                        t.sendToAll("ROOMSLIST@" + t.getStringWithListOfRooms());
                        return;
                    }

                    if(id === room.player_1.id){
                        const loginOfDeletedUser = t.logins[id].toString();
                        t.deleteUser(id);
                        t.sendMessage(room.player_1.id,"ROOM_WAS_DELETED");
                        t.sendMessage(room.player_2.id,"ROOM_WAS_DELETED");
                        t.sendMessage(room.player_3.id,"ROOM_WAS_DELETED");
                        t.sendToAll("DELETED_ROOM@" + loginOfDeletedUser);
                        t.rooms.splice(i,1);
                    }
                }

                for(let i = 0; i < t.rooms.length; i++){
                    const room = t.rooms[i];
                    if(id === room.player_2.id || id === room.player_3.id){

                        if(id === room.player_2.id){
                            t.deleteUser(id);
                            room.player_2.id = "";
                            room.player_2.login = "";
                            if(room.player_3.id !== ""){
                                room.player_2.id = room.player_3.id;
                                room.player_2.login = room.player_3.login;
                                room.player_3.id = "";
                                room.player_3.login = "";
                            }

                            room.changePlayersNumber();

                            const id_1 = room.player_1.id;
                            const id_2 = room.player_2.id;
                            const id_3 = room.player_3.id;

                            const login_1 = room.player_1.login;
                            const login_2 = room.player_2.login;
                            const login_3 = room.player_3.login;

                            const infoMessage = "ROOM_PLAYERS@" + login_1 + "@" + login_2 + "@" + login_3;

                            t.sendMessage(id_1,infoMessage);
                            t.sendMessage(id_2,infoMessage);
                            t.sendMessage(id_3,infoMessage);

                            break;
                        }

                        if(id === room.player_3.id){
                            t.deleteUser(id);
                            room.player_3.id = "";
                            room.player_3.login = "";

                            room.changePlayersNumber();

                            const id_1 = room.player_1.id;
                            const id_2 = room.player_2.id;
                            const id_3 = room.player_3.id;

                            const login_1 = room.player_1.login;
                            const login_2 = room.player_2.login;
                            const login_3 = room.player_3.login;

                            const infoMessage = "ROOM_PLAYERS@" + login_1 + "@" + login_2 + "@" + login_3;

                            t.sendMessage(id_1,infoMessage);
                            t.sendMessage(id_2,infoMessage);
                            t.sendMessage(id_3,infoMessage);
                            break;
                        }
                    }
                }

                t.printRooms();
                t.deleteUser(id);
                t.printClientsAndLogins();
                t.sendToAll("ROOMSLIST@" + t.getStringWithListOfRooms());
            });
        });
    }
}
