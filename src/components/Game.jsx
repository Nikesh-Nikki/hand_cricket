import React from "react";
import { useEffect , useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

export default function Game (){
    const [socket , setSocket] = useState(undefined);
    const { roomCode } = useParams();
    useEffect(
        () => {
            const temp_socket = io(import.meta.env.VITE_BE_URL + "/");
            alert(roomCode);
            temp_socket.emit(
                'init' , 
                {
                    roomCode
                }
            );
            temp_socket.on("hey" , () => console.log('helloo'));
            setSocket(temp_socket);
        } ,
        []
    );

    return (
        <h1>{roomCode}</h1>
    );
};