import React from "react";

export default function Sign({value , cb}){
    return (
        <button onClick={()=>cb(value)}>  {value} </button>
    );
}