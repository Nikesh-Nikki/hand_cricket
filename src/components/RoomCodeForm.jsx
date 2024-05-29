import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RoomCodeForm(){
    
    const [roomCode,setRoomCode] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();
        if(roomCode.length == 0){
            try{
                //sending the backend the room code
                const response  = await axios.post(
                        import.meta.env.VITE_BE_URL+"/init" , 
                        {
                            headers : {
                                "Access-Control-Allow-Origin": "*"
                            }
                        }  
                );
                navigate("/game/"+response.data.roomCode);
            }catch(err){
                alert(err.response.data.message);
            }
        }
        else navigate("/game/"+roomCode)
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Enter a Room code if you have..!! or else just submit enter.</label>
            <input type="text" name = "room_code" onChange={(e)=>setRoomCode(e.target.value)}></input>
            <button type="submit">Submit</button>
        </form>
    );
}