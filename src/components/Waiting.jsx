import React from "react";

export default function Waiting({players , emitStart}){
    return (
        <>
            {
                players.map(
                    (p) => <p>p.username</p>
                )
            }
            <button onClick = {emitStart}>Start the Game</button>
        </>
    )
}