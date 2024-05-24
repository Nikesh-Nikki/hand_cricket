import React from "react";

export default function ScoreBoard({ scoreA , scoreB , battingA }) {
    return (
        <>
            <p> A : {scoreA} {battingA && '*'}</p>
            <p> B : {scoreB} {!battingA && '*'}</p>
        </>
    );
}