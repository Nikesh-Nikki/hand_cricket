import React from "react";
import { useEffect , useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Panel from "./Panel";
import SignPad from "./SignPad";
import ScoreBoard from "./ScoreBoard";

export default function Game (){
    const [socket , setSocket] = useState(undefined);
    // temporary state for which team a player is in. REMOVE this after authorization is implemented.
    const [team , setTeam] = useState(undefined);
    const { roomCode } = useParams();
    const [gameState,setGameState] = useState(
        {
            ballA : 0,
            ballB : 0,
            scoreA : 0,
            scoreB : 0,
            battingA : true,
            inningsOver : 0,
            signActive : true
        }
    );
    // debugger;
    function gameControl( ballA , ballB ){
        // debugger;
        let inningsOver = gameState.inningsOver;
        let battingA = gameState.battingA;
        let scoreA = gameState.scoreA;
        let scoreB = gameState.scoreB;
        if(ballA == ballB) {
            inningsOver++;
            //assuming it is 2 innings / match
            if(inningsOver == 2) {
                // note that inningsOver updates for next render
                if(scoreA == scoreB) console.log('draw')
                else {
                    if(battingA) console.log('B won')
                    else console.log('A won')
                }
            } else battingA = !battingA;
        } else{
            if(battingA) {
                console.log(scoreA);
                scoreA += ballA;
                if(inningsOver == 1
                    && scoreA > scoreB) 
                    console.log('A won')
                }
            else {
                    scoreB += ballB;
                    if(inningsOver == 1
                        && scoreB > scoreA) 
                        console.log('B won')
                }
        }

        setGameState(
            {
                inningsOver , 
                scoreA,
                scoreB, 
                ballA,
                ballB,
                battingA,
                signActive : false
            }
        );
    }

    function playBall(data){
        console.log(gameState);
        gameControl(data.ballA , data.ballB);
        setTimeout(
            ()=>{
                setGameState(
                    (gs) =>
                    {
                       return {
                            ...gs , 
                            ballA : 0 , 
                            ballB : 0,
                            signActive : true
                        }
                    }
                )
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
        function() {
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
            setSocket(temp_socket);
            return (
                () => temp_socket.disconnect()
            )
        } ,
        []
    );
    
    if(socket){
        if(!socket.hasListeners("hey")) socket.once("hey" , () => console.log('helloo'))
        if(!socket.hasListeners("play")) socket.once("play" , function(data) { playBall(data) })
    }

    return (
        <>
            <h1>{roomCode}</h1>
            <Panel ball = {gameState.ballA}/>
            <Panel ball = {gameState.ballB}/>
            <SignPad cb = {sendBall} active={gameState.signActive}/>
            <ScoreBoard scoreA={gameState.scoreA} scoreB={gameState.scoreB} battingA={gameState.battingA}/>
        </>
    );
};