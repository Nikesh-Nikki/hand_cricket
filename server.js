import express from "express";
import { Server } from "socket.io";

const app = express();
const port = 3000;

const io = new Server(
        app.listen(
            port , 
            () => console.log('server started')
        )
);

io.on( 'connect' ,
    (socket)=>{
        
    }
);