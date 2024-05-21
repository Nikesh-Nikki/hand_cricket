import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const io = new Server(
        app.listen(
            port , 
            () => console.log('server started')
        )
);

app.post("/init" , 
    (req,res)=>{
        console.log(req.body);
        res.sendStatus(200);
    }
);

io.on( 'connect' ,
    (socket)=>{
        
    }
);