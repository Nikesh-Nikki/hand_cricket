import React from "react";
import { Link } from "react-router-dom";

export default function LogIn(){
    function handleSubmit(e){
        e.preventDefault()
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type = "text"></input>
                <input type = "password"></input>
            </form>
            <Link to = "create_account">
                Create Account Instead
            </Link>
        </>
    )
}