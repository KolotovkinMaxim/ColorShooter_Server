"use strict";

export default class Room{
    constructor(){
        this.playerNumber = 1;

        this.player_1 = {
            id: "",
            login: ""
        };

        this.player_2 = {
            id: "",
            login: ""
        };

        this.player_3 = {
            id: "",
            login: ""
        };

        this.gameStarted = false;
    }

    isIdInRoom(id){
        if(id === this.player_1.id) {
            return true;
        }
        if(id === this.player_2.id) {
            return true;
        }
        if(id === this.player_3.id) {
            return true;
        }
        return false;
    }

    getTypeOfPlayer(id){
        if(id === this.player_1.id) {
            return 1;
        }
        if(id === this.player_2.id) {
            return 2;
        }
        if(id === this.player_3.id) {
            return 3;
        }
        return 0;
    }

    addPlayer(id,login){
        if(this.gameStarted === false) {
            id = id.toString();
            login = login.toString();

            if (this.playerNumber === 1) {
                this.player_1.id = id;
                this.player_1.login = login;
                this.playerNumber = 2;
                return;
            }

            if (this.playerNumber === 2) {
                this.player_2.id = id;
                this.player_2.login = login;
                this.playerNumber = 3;
                return;
            }

            if (this.playerNumber === 3) {
                this.player_3.id = id;
                this.player_3.login = login;
                this.playerNumber = 4;
                // start game
                this.gameStarted = true;
                this.startGameAndInitProperties();
            }
        }
    }

    startGameAndInitProperties(){
        // score of game
        this.score = 0;

        // vector of moving
        this.player_1.up = false;
        this.player_1.down = false;
        this.player_1.left = false;
        this.player_1.right = false;

        this.player_2.up = false;
        this.player_2.down = false;
        this.player_2.left = false;
        this.player_2.right = false;

        this.player_3.up = false;
        this.player_3.down = false;
        this.player_3.left = false;
        this.player_3.right = false;

        // position
        this.player_1.x = 150;
        this.player_1.y = 150;

        this.player_2.x = 250;
        this.player_2.y = 150;

        this.player_3.x = 350;
        this.player_3.y = 150;

        // watch vector
        this.player_1.w = "RIGHT";
        this.player_2.w = "RIGHT";
        this.player_3.w = "RIGHT";

        const t = this;

        this.vrags = [];
        this.monsterType = 1;

        this.pulls = [];

        // pulls generator
        t.pullsGenerator = setInterval(function(){
            console.log("Intervals of PULLS works !!!");
            let pull_red = {
                vector: t.player_1.w,
                x: t.player_1.x + 20,
                y: t.player_1.y + 20,
                color: 1,
                s:0
            };

            let pull_green = {
                vector: t.player_2.w,
                x: t.player_2.x + 20,
                y: t.player_2.y + 20,
                color: 2,
                s:0
            };

            let pull_blue = {
                vector: t.player_3.w,
                x: t.player_3.x + 20,
                y: t.player_3.y + 20,
                color: 3,
                s:0
            };

            t.pulls.push(pull_red);
            t.pulls.push(pull_green);
            t.pulls.push(pull_blue);

            console.log("Pulls number: " + t.pulls.length);

        }, 800);

        // vrag generator interval
        t.vragInterval = setInterval(function(){
            console.log("Interval of VRAG GENERATE works !!!");
            // if vrags is not very much
            if(t.vrags.length < 20) {
                let vragObj = {
                    speed: parseInt(Math.random() * 2) + 2,
                    goal: parseInt(Math.random() * 3) + 1,
                    type: t.monsterType
                };

                if (t.monsterType === 1) {
                    t.monsterType = 2;
                } else if (t.monsterType === 2) {
                    t.monsterType = 3;
                } else if (t.monsterType === 3) {
                    t.monsterType = 1;
                }

                const side = parseInt(Math.random() * 4) + 1;
                if (side === 1) {
                    vragObj.x = -100;
                    vragObj.y = parseInt(Math.random() * 500);
                }
                if (side === 3) {
                    vragObj.x = 800;
                    vragObj.y = parseInt(Math.random() * 500);
                }
                if (side === 2) {
                    vragObj.x = parseInt(Math.random() * 700);
                    vragObj.y = -100;
                }
                if (side === 4) {
                    vragObj.x = parseInt(Math.random() * 700);
                    vragObj.y = 600;
                }
                t.vrags.push(vragObj);
            }
            console.log("Vrags number:  " + t.vrags.length);
        }, 1200);

        // interval of moving
        t.interval = setInterval(function(){
            console.log("Interval of MOVE works !!!");
            t.moveOfPlayers();

            let myObj = {};

            myObj.x1 = t.player_1.x;
            myObj.y1 = t.player_1.y;
            myObj.w1 = t.player_1.w;

            myObj.x2 = t.player_2.x;
            myObj.y2 = t.player_2.y;
            myObj.w2 = t.player_2.w;

            myObj.x3 = t.player_3.x;
            myObj.y3 = t.player_3.y;
            myObj.w3 = t.player_3.w;

            for(let i = 0; i < t.vrags.length; i++){
                try {
                    let vragObj = t.vrags[i];
                    let goToHero = vragObj.goal;

                    if (goToHero === 1) {
                        if (myObj.x1 > vragObj.x) {
                            vragObj.x += vragObj.speed;
                        } else {
                            vragObj.x -= vragObj.speed;
                        }

                        if (myObj.y1 > vragObj.y) {
                            vragObj.y += vragObj.speed;
                        } else {
                            vragObj.y -= vragObj.speed;
                        }
                    }

                    if (goToHero === 2) {
                        if (myObj.x2 > vragObj.x) {
                            vragObj.x += vragObj.speed;
                        } else {
                            vragObj.x -= vragObj.speed;
                        }

                        if (myObj.y2 > vragObj.y) {
                            vragObj.y += vragObj.speed;
                        } else {
                            vragObj.y -= vragObj.speed;
                        }
                    }

                    if (goToHero === 3) {
                        if (myObj.x3 > vragObj.x) {
                            vragObj.x += vragObj.speed;
                        } else {
                            vragObj.x -= vragObj.speed;
                        }

                        if (myObj.y3 > vragObj.y) {
                            vragObj.y += vragObj.speed;
                        } else {
                            vragObj.y -= vragObj.speed;
                        }
                    }
                } catch(err) {
                    // error of working with vrag
                }
            }

            const pullSpeed = 14;

            for(let i = 0; i < t.pulls.length; i++){
                try {
                    let pull = t.pulls[i];
                    if (pull.vector === "RIGHT") {
                        pull.x += pullSpeed;
                    }
                    if (pull.vector === "LEFT") {
                        pull.x -= pullSpeed;
                    }
                    if (pull.vector === "UP") {
                        pull.y -= pullSpeed;
                    }
                    if (pull.vector === "DOWN") {
                        pull.y += pullSpeed;
                    }
                    // make bigger way of moving
                    pull.s += pullSpeed;
                } catch (err) {
                    // error of working with pull
                }
            }


            // if pull hitTest vrag - delete pull and vrag
            for(let i = 0; i < t.pulls.length; i++){
                for(let j = 0; j < t.vrags.length; j++){
                    try {
                        // i - pulls
                        // j - vrags
                        const pull = t.pulls[i];
                        const vrag = t.vrags[j];
                        // is pull and vrag have similar color
                        if(pull.color === vrag.type) {
                            if (t.hitTest(vrag.x, vrag.y, 50, pull.x + 5, pull.y + 5) === true) {
                                // delete pull and vrag
                                t.pulls.splice(i, 1);
                                t.vrags.splice(j, 1);
                                i = 0;
                                j = 0;
                                // inc score
                                t.score += 1;
                            }
                        }
                    } catch (err) {
                        // error of hitTest
                        console.log("Error of hitTest ________________________________");
                    }
                }
            }

            // if pull fly very long - delete pull
            for(let i = 0; i < t.pulls.length; i++){
                try {
                    if (t.pulls[i].s >= 200) {
                        t.pulls.splice(i, 1);
                        i = 0;
                    }
                } catch(err) {
                    // error of deleting pull
                }
            }

            // control is one of heroes killed
            for (let i = 0; i < t.vrags.length; i++) {
                try {
                    let vrag = t.vrags[i];
                    let v_x = vrag.x + 25;
                    let v_y = vrag.y + 25;

                    let x1 = t.player_1.x + 25;
                    let y1 = t.player_1.y + 25;

                    let x2 = t.player_2.x + 25;
                    let y2 = t.player_2.y + 25;

                    let x3 = t.player_3.x + 25;
                    let y3 = t.player_3.y + 25;

                    if(t.wayBetweenObjects(v_x,v_y,x1,y1) <= 25){
                        t.sendToPlayers("GAME_FINISHED");
                    }

                    if(t.wayBetweenObjects(v_x,v_y,x2,y2) <= 25){
                        t.sendToPlayers("GAME_FINISHED");
                    }

                    if(t.wayBetweenObjects(v_x,v_y,x3,y3) <= 25){
                        t.sendToPlayers("GAME_FINISHED");
                    }
                } catch (err) {
                    // error of control hitTest between vrag and heroes
                }
            }

            myObj.score = t.score;
            myObj.vrags = t.vrags;
            myObj.pulls = t.pulls;
            let message = encodeURIComponent(JSON.stringify(myObj));
            message = "GAME_CONTENT@" + message;
            t.sendToPlayers(message);

        }, 50);
    }

    wayBetweenObjects(x0,y0,x1,y1){
        const dx = x0 - x1;
        const dy = y0 - y1;
        const kvadrat = dx * dx + dy * dy;
        const koren = Math.sqrt(kvadrat);
        return parseInt(koren);
    }

    hitTest(x0,y0,w,x1,y1){
        if(x0 <= x1 && x1 <= x0 + w){
            if(y0 <= y1 && y1 <= y0 + w){
                return true;
            }
        }
        return false;
    }

    deleteAllIntervals(){
        try {
            console.log("Intervals are deleted.");
            clearInterval(this.interval);
            clearInterval(this.vragInterval);
            clearInterval(this.pullsGenerator);
        } catch(err) {
            // error of deleting intervals
        }
    }

    initClientsArray(clients){
        this.clients = clients;
    }

    sendToPlayers(message){
        message = message.toString();
        try{
            this.clients[this.player_1.id].send(message);
            this.clients[this.player_2.id].send(message);
            this.clients[this.player_3.id].send(message);
        } catch(err) {
           // err of sending message
        }
    }

    setAction(playerType, keyType, operationType){
        if(playerType === 1){
            const player = this.player_1;
            if(operationType === "PUSH"){
                if(keyType === "UP") player.up = true;
                if(keyType === "DOWN") player.down = true;
                if(keyType === "LEFT") player.left = true;
                if(keyType === "RIGHT") player.right = true;
            } else {
                if(keyType === "UP") player.up = false;
                if(keyType === "DOWN") player.down = false;
                if(keyType === "LEFT") player.left = false;
                if(keyType === "RIGHT") player.right = false;
            }
        }

        if(playerType === 2){
            const player = this.player_2;
            if(operationType === "PUSH"){
                if(keyType === "UP") player.up = true;
                if(keyType === "DOWN") player.down = true;
                if(keyType === "LEFT") player.left = true;
                if(keyType === "RIGHT") player.right = true;
            } else {
                if(keyType === "UP") player.up = false;
                if(keyType === "DOWN") player.down = false;
                if(keyType === "LEFT") player.left = false;
                if(keyType === "RIGHT") player.right = false;
            }
        }

        if(playerType === 3){
            const player = this.player_3;
            if(operationType === "PUSH"){
                if(keyType === "UP") player.up = true;
                if(keyType === "DOWN") player.down = true;
                if(keyType === "LEFT") player.left = true;
                if(keyType === "RIGHT") player.right = true;
            } else {
                if(keyType === "UP") player.up = false;
                if(keyType === "DOWN") player.down = false;
                if(keyType === "LEFT") player.left = false;
                if(keyType === "RIGHT") player.right = false;
            }
        }
    }

    moveOfPlayers(){
        let player = null;
        const speed = 8;

        player = this.player_1;
        if(player.right === true){
            player.w = "RIGHT";
            player.x += speed;
        }
        if(player.left === true){
            player.w = "LEFT";
            player.x -= speed;
        }
        if(player.up === true){
            player.w = "UP";
            player.y -= speed;
        }
        if(player.down === true){
            player.w = "DOWN";
            player.y += speed;
        }

        player = this.player_2;
        if(player.right === true){
            player.w = "RIGHT";
            player.x += speed;
        }
        if(player.left === true){
            player.w = "LEFT";
            player.x -= speed;
        }
        if(player.up === true){
            player.w = "UP";
            player.y -= speed;
        }
        if(player.down === true){
            player.w = "DOWN";
            player.y += speed;
        }

        player = this.player_3;
        if(player.right === true){
            player.w = "RIGHT";
            player.x += speed;
        }
        if(player.left === true){
            player.w = "LEFT";
            player.x -= speed;
        }
        if(player.up === true){
            player.w = "UP";
            player.y -= speed;
        }
        if(player.down === true){
            player.w = "DOWN";
            player.y += speed;
        }
    }

    changePlayersNumber(){
        if(this.gameStarted === false) {
            this.playerNumber = 4;

            if (this.player_1.id === "") {
                this.playerNumber--;
            }
            if (this.player_2.id === "") {
                this.playerNumber--;
            }
            if (this.player_3.id === "") {
                this.playerNumber--;
            }
        } else {
            // game is already started
        }
    }

    getNumber(){
        return this.playerNumber;
    }
}
