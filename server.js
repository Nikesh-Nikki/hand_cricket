import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import db from "./utils/db.js"
import bcrypt from "bcrypt";
import uniqid from "uniqid"
import authenticator from "./utils/auth.js";

dotenv.config(); // for process.env
await db.init();
const auth = new authenticator(db)

const app = express();
const port = 3000;

app.use(cors(
    {
        origin : process.env.REACT_URL , 
        credentials : true
    }
));
app.use(bodyParser.json());
app.use(cookieParser());

let games = [];

const io = new Server(
        app.listen(
            port , 
            () => console.log('server started')
        ) , 
        {
            cors : {
                origin : process.env.REACT_URL , 
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
        ballA : -1,
        ballB : -1,
        count : 0 , 
        scount : 0
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
        const roomCode = req.body.data?.roomCode;
        if(roomCode == undefined || roomCode.length === 0){
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

app.get("/auth", auth.sessionAuth , async (req,res) => {
    if(req.isAuth) {
        res.sendStatus(200)
    } else {
        res.status(401).send(
            {
                message : "user not authenticated"
            }
        )
    }
})

app.post("/login" , async (req,res)=>{
    const {username ,password} = req.body
    const user = await db.getByUsername(username)
    console.log(user)
    if(await bcrypt.compare(password,user.pwd_hash)){
        console.log("access granted")
        const session_token = uniqid.process()
        res.cookie("sessionToken",session_token)
        res.sendStatus(200)
        let d = new Date()
        d.setDate(d.getDate()+1)
        await db.insertToken(username,session_token,d.toISOString())
    } else {
        res.status(401).send(
            {
                message : "invalid credentials"
            }
        )
    }
})

app.post( "/create_account" , async (req,res)=>{
    console.log(req.body)
    const {username , password} = req.body;
    const hash = await bcrypt.hash(password,0)
    console.log(hash)
    try {
        await db.insert(username,hash)
        res.sendStatus(200)
    } catch(err){
        console.log("catch blockk")
        res.status(409).send(
            {
                message : "username already exists"
            }
        )
    }
})

io.on( 'connect' ,
    (socket)=>{
        console.log("connect ayyaadu");
        socket.on(
            "init" , 
            (data , cb) =>{
                console.log(data);
                socket.join(data.roomCode);
                console.log("joined the client to room "+ data.roomCode);
                io.to(data.roomCode).emit("hey");
                let room = getGame(data.roomCode);
                if(room){
                    if(room.scount%2) cb('A');
                    else cb('B');
                    room.scount++;
                }
            }
        );

        socket.on(
            "ball" , 
            ({team,value,roomCode}) => {
                console.log(`${roomCode + ' : ' + team} played value ${value}`);
                let game = getGame(roomCode);
                if(team == 'A'){
                    // if player already made the move, then return
                    if(game.ballA != -1) return;
                    game.ballA = value;
                } else {
                    if(game.ballB != -1) return;
                    game.ballB = value;
                }
                if(game.ballA == -1 || game.ballB == -1) return;
                //if both players made their moves
                io.to(roomCode).emit("play" , {
                    ballA : game.ballA , 
                    ballB : game.ballB
                });
                //resetting
                game.ballA = -1;
                game.ballB = -1;
            }
        )

        socket.on(
            "disconnect" ,
            ()=>{
                console.log('disconnected');
            }
        )
    }
);