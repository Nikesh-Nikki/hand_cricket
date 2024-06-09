import React from "react";

export default function Team({players , player, team ,score , battingA}){
    return (
        <div className="team" id = {"team-"+team}>
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
            {
                players.map(
                    (p , i) => {
                        if(p.team == team)
                            return (<div key = {p.username} className={`player ${(i%2)?'odd':' '}`}> {p.username + ((p.username==player)?'*':'')} </div>)
                    }
                )
            }
        </div>
    )
}