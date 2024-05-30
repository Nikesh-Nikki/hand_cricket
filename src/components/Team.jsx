import React from "react";

export default function Team({players , player, team ,score , battingA}){
    return (
        <>
            <h2>Team : {team} </h2>
            <h3>
                {
                    (
                        ()=>{
                            if(team == 'A' && battingA || (team=='B'&&!battingA)) return "Batting"  
                            else return "Bowling"
                        }
                    )()
                }
            </h3>
            <h3>{score}</h3>
            {
                players.map(
                    (p) => {
                        if(p.team == team)
                            return (<p key = {p.username}> {p.username + ((p.username==player)?'*':'')} </p>)
                    }
                )
            }
        </>
    )
}