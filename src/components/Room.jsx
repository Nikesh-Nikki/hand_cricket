import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Game from "./Game";
import Waiting from "./Waiting";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true

export default function Room(){
    const [socket , setSocket] = useState()
    const [loading , setLoading] = useState(true)
    const [gameData , setGameData] = useState()
    const {roomCode} = useParams()
    const navigate = useNavigate()

    function sendBall(value){
        socket.emit(
            'ball' ,
            {
                value , 
                team : gameData.team
            }
        )
    }

    useEffect(
        function() {
            function establishSocket(){
                const temp_socket = io(import.meta.env.VITE_BE_URL + "/")
                temp_socket.emit(
                    'init' , 
                    {
                        roomCode 
                    } , 
                    (gameData) => {
                        setGameData(gameData)
                        setLoading(false)
                    }
                )
                temp_socket.on(
                    'play' , 
                    (gameData) => {
                        setGameData(gameData)
                        setTimeout(
                            () => setGameData(
                                (data) => {
                                    return (
                                        {
                                            ...data , 
                                            ballA : 0,
                                            ballB : 0
                                        }
                                    )
                                }
                            )
                        )
                    }
                )
                temp_socket.on(
                    'join' , 
                    (player)=>{
                        let new_players = gameData.players;
                        new_players.push(player)
                        setGameData(
                            (gameData) => {
                                return (
                                    {
                                        ...gameData , 
                                        players : new_players
                                    }
                                )
                            }
                        )
                    }
                )
                setSocket(temp_socket)
                return (
                    () => temp_socket.disconnect()
                )
            }
            async function auth(){
                // see if user can join the room
                const res = await axios.get(
                    import.meta.env.VITE_BE_URL+"/room_auth" , 
                    {
                        roomCode
                    }
                )
                //user is authrized
                if(res.status == 200){
                    establishSocket()
                } else {
                    alert(res.data.message)
                    navigate("/")
                }
            }

            auth()
        } ,
        []
    )

    return (
        (loading && <h1>Loadinggg.....</h1>)
        ||
        (
            (gameData.gameInProgress) ? <Game {...gameData} sendBall={sendBall}/> : <Waiting players = {gameData.players}/>
        )
    )
}