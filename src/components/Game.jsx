import React from "react";
import { useEffect , useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Panel from "./Panel";
import SignPad from "./SignPad";

export default function Game (){
    const [socket , setSocket] = useState(undefined);
    // temporary state for which team a player is in. REMOVE this after authorization is implemented.
    const [team , setTeam] = useState(undefined);
    const { roomCode } = useParams();
    const [ballA , setBallA] = useState();
    const [ballB , setBallB] = useState();
    const [signActive , setSignActive] = useState();

    function playBall(data){
        setBallA(data.ballA);
        setBallB(data.ballB);
        setTimeout(
            ()=>{
                setBallA(0);
                setBallB(0);
                setSignActive(true);
            } , 
            2000
        );
    }

    function sendBall(value){
        socket.emit('ball' , {
            team ,
            value , 
            roomCode
        });
    }

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
            temp_socket.on("play" , (data) => playBall(data))
            setSocket(temp_socket);
            return (
                () => temp_socket.disconnect()
            )
        } ,
        []
    );

    if(team) console.log(team);

    return (
        <>
            <h1>{roomCode}</h1>
            <Panel ball = {ballA}/>
            <Panel ball = {ballB}/>
            <SignPad cb = {sendBall}/>
        </>
    );
};