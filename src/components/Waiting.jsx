import React from "react";

export default function Waiting({players}){
    return (
        <>
            {
                players.map(
                    (p) => <p>p.username</p>
                )
            }
        </>
    )
}