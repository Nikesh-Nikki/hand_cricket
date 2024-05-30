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
    console.log(gameData)
    function sendBall(value){
        socket.emit(
            'ball' ,
            {
                value , 
                team : gameData.team
            }
        )
    }

    function emitStart(){
        socket.emit('start')
    }

    useEffect(
        function() {
            const temp_socket = io(import.meta.env.VITE_BE_URL + "/")
            function establishSocket(username){
                temp_socket.emit(
                    'init' , 
                    {
                        roomCode ,
                        username
                    } , 
                    (gameData) => {
                        setGameData(gameData)
                        setLoading(false)
                    }
                )
                temp_socket.on(
                    'play' , 
                    (gameData) => {
                        alert(gameData.ballA + " "+gameData.ballB)
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
                            ) , 
                            2000
                        )
                    }
                )
                temp_socket.on(
                    'join' , 
                    (new_players)=>{
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
                temp_socket.on('start' , 
                    (data) => {
                        setGameData(data)
                    }
                )
                setSocket(temp_socket)
                return (
                    () => temp_socket.disconnect()
                )
            }
            async function auth(){
                try{
                    // see if user can join the room
                    const res = await axios.post(
                        import.meta.env.VITE_BE_URL+"/room_auth" , 
                        {
                            roomCode
                        }
                    )
                    //user is authrized
                    if(res.status == 200){
                        return establishSocket(res.data.username)
                    } else {
                        alert(res.data.message)
                        navigate("/")
                    }
                } catch (err) {
                    alert(err.response.data.message)
                    navigate("/")
                }
            }

            auth()

            return () => temp_socket.disconnect()
        } ,
        []
    )

    return (
        (loading && <h1>Loadinggg.....</h1>)
        ||
        (
            (gameData.gameInProgress) ? <Game {...gameData} sendBall={sendBall}/> : <Waiting players = {gameData.players} emitStart={emitStart}/>
        )
    )
}