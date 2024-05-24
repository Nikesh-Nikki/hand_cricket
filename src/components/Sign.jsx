import React from "react";

export default function Sign({value , cb , active}){
    return (
        <button onClick={()=>cb(value)}>  {value} </button>
    );
}