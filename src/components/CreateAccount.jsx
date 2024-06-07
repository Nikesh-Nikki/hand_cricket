import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import '../styles/login.scss'

export default function CreateAccount(){

    const [state , setState] = useState(
        {
            username : "",
            password : "",
            confirmPassword : "",
            error : undefined
        }
    )
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()
        if(state.password == state.confirmPassword){
            try {
                const response = await axios.post(
                    import.meta.env.VITE_BE_URL + "/create_account" , 
                    {
                        username : state.username, 
                        password : state.password
                    }
                )
                if(response.status === 200){
                    navigate("/")
                } else {
                    setState(
                        {
                            username : "",
                            password : "",
                            confirmPassword : "",
                            error : response.data.message
                        }
                    )
                }
            } catch(err) {
                setState(
                    {
                        username : "",
                        password : "",
                        confirmPassword : "",
                        error : err.response.data.message
                    }
                )
            }
        }else{
            setState(
                {
                    ...state , 
                    error : "password and confirm password must match"
                }
            )
        }
    }
    return (
        <div id = "create-account-component">
            <div id = "create-account">
                {
                    (state.error) ? <div className = "error">{state.error}</div> : undefined
                }
                <form onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input type = "text" name = "username" onChange = {(e)=>{setState({...state , username : e.target.value})}}></input>
                    <label>Password</label>
                    <input type = "password" id = "password" name = "password"
                    onChange = {(e)=>{setState({...state , password : e.target.value})}}></input>
                    <label>Confirm Password</label>
                    <input type = "password" id = "confirmPassword"
                    onChange = {(e)=>{setState({...state , confirmPassword : e.target.value})}}></input>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}