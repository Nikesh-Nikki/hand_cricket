import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LogIn(){

    const [state,setState] = useState({
        username : "" , 
        password : "" , 
        error : undefined
    });
    const navigate = useNavigate();
    async function handleSubmit(e){
        e.preventDefault()
        try {
            const response = await axios.post(
                import.meta.env.VITE_BE_URL + "/login" , 
                {
                    username : state.username, 
                    password : state.password
                }
            )
            if(response.status == 200) window.location.reload()
            else { 
                setState({
                    username : "" , 
                    password : "",
                    error : response.data.message
                })
            }
        } catch(err){
            console.log(err)
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>username</label>
                <input type = "text" name = "username" value={state.username} onChange = {(e)=>{setState({...state , username : e.target.value})}}></input>
                <label>password</label>
                <input type = "password" id = "password" name = "password" value={state.password}
                 onChange = {(e)=>{setState({...state , password : e.target.value})}}></input>
                 <button type = "submit">Submit</button>
            </form>
            <Link to = "create_account">
                Create Account Instead
            </Link>
        </>
    )
}