import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let games = [];

const io = new Server(
        app.listen(
            port , 
            () => console.log('server started')
        ) , 
        {
            cors : {
                origin : "*" , 
                methods : ["GET","POST"]
            }
        }
);

function getGame(roomCode){
    return (
        games.find(
            (game) => (game.roomCode == roomCode)
        )
    );
}

function randomCode(){
    let code = "";
    const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for(let i =  0 ;i < 6 ; i++){
        code += str[Math.floor(Math.random()*26)];
    }

    return code;
}

function roomCodeGenerator(){
    let code = randomCode();
    while(getGame(code)) code = randomCode();
    return code;
}

function createGame(){
    let game = {
        roomCode : roomCodeGenerator() , 
        BallA : -1,
        BallB : -1,
        count : 0
    };
    games.push(game);
    return game;
}

function joinGame(roomCode){
    const game = getGame(roomCode);
    game.count++;
}

app.post("/init" , 
    (req,res)=>{
        console.log(req.body);
        const roomCode = req.body.data.roomCode;
        if(roomCode.length === 0){
            // NO room code is given. so new room is created.
            console.log("new game is being created");
            const game = createGame();
            joinGame(game.roomCode);
            res.status(200).send(
                {
                    roomCode  : game.roomCode
                }
            );
        }else{
            const gameReq = getGame(roomCode);
            console.log(gameReq);
            if(gameReq){
                // Room already Exists

                if(gameReq.count == 2) {
                    //Already there are two players
                    res.status(400).send({
                        message : "already two players exist"
                    })
                }
                else {
                    //There is only one other
                    joinGame(gameReq.roomCode);
                    res.status(200).send({
                        roomCode
                    });
                }
            }
            else{
                //if game doesnt exist
                res.status(400).send({
                    message : "invalid room code"
                });
            }
        }
    }
);

io.on( 'connect' ,
    (socket)=>{
        console.log("connect ayyaadu");
        socket.on(
            "init" , 
            (data) =>{
                console.log(data);
                socket.join(data.roomCode);
                console.log("joined the client to room "+ data.roomCode);
                io.to(data.roomCode).emit("hey");
            }
        );
        socket.on(
            "disconnect" ,
            ()=>console.log('disconnected')
        )
    }
);