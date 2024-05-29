import React from "react";
import { useEffect ,  useState } from "react";
import Panel from "./Panel";
import SignPad from "./SignPad";
import ScoreBoard from "./ScoreBoard";
import { useParams } from "react-router-dom";

export default function Game ({socket , team , roomCode , ballA , ballB , scoreA , scoreB , battingA , sendBall}){
    // function gameControl( ballA , ballB ){
    //     let inningsOver = gameState.inningsOver;
    //     let battingA = gameState.battingA;
    //     let scoreA = gameState.scoreA;
    //     let scoreB = gameState.scoreB;
    //     if(ballA == ballB) {
    //         inningsOver++;
    //         //assuming it is 2 innings / match
    //         if(inningsOver == 2) {
    //             // note that inningsOver updates for next render
    //             if(scoreA == scoreB) console.log('draw')
    //             else {
    //                 if(battingA) console.log('B won')
    //                 else console.log('A won')
    //             }
    //         } else battingA = !battingA;
    //     } else{
    //         if(battingA) {
    //             console.log(scoreA);
    //             scoreA += ballA;
    //             if(inningsOver == 1
    //                 && scoreA > scoreB) 
    //                 console.log('A won')
    //             }
    //         else {
    //                 scoreB += ballB;
    //                 if(inningsOver == 1
    //                     && scoreB > scoreA) 
    //                     console.log('B won')
    //             }
    //     }
    // }

    return (
        <>
            <h1>{roomCode}</h1>
            <Panel ball = {ballA}/>
            <Panel ball = {ballB}/>
            <SignPad cb = {sendBall} active={true}/>
            <ScoreBoard scoreA={scoreA} scoreB={scoreB} battingA={battingA}/>
        </>
    );
};