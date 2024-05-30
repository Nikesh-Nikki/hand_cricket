import React from "react";
import Panel from "./Panel";
import SignPad from "./SignPad";
import Team from "./Team";

export default function Game ({ roomCode , ballA , ballB , scoreA , scoreB , battingA , sendBall, players , playerA , playerB}){

    return (
        <>
            <h1>{roomCode}</h1>
            <Panel ball = {ballA}/>
            <Panel ball = {ballB}/>
            <SignPad cb = {sendBall} active={true}/>
            <Team team = 'A' players={players} player={playerA} score = {scoreA} battingA = {battingA}/>
            <Team team = 'B' players={players} player={playerB} score = {scoreB} battingA = {battingA}/>
        </>
    );
};