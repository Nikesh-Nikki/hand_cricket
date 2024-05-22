import React from "react";
import { useEffect , useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

export default function Game (){
    const [socket , setSocket] = useState(undefined);
    // temporary state for which team a player is in. REMOVE this after authorization is implemented.
    const [team , setTeam] = useState(undefined);
    const { roomCode } = useParams();

    useEffect(
        () => {
            const temp_socket = io(import.meta.env.VITE_BE_URL + "/");
            temp_socket.emit(
                'init' , 
                {
                    roomCode
                } ,
                (temp) => {
                    setTeam(temp);
                }
            );
            temp_socket.on("hey" , () => console.log('helloo'));
            setSocket(temp_socket);
            return (
                () => temp_socket.disconnect()
            )
        } ,
        []
    );

    if(team) console.log(team);

    return (
        <h1>{roomCode}</h1>
    );
};