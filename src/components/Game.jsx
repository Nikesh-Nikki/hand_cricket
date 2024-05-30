import React from "react";
import { useEffect ,  useState } from "react";
import Panel from "./Panel";
import SignPad from "./SignPad";
import ScoreBoard from "./ScoreBoard";
import { useParams } from "react-router-dom";

export default function Game ({socket , team , roomCode , ballA , ballB , scoreA , scoreB , battingA , sendBall}){

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