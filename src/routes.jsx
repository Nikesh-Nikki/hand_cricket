import React from "react";
import Home from "./components/Home.jsx"
import Game from "./components/Game.jsx"
import CreateAccount from "./components/CreateAccount.jsx";

const routes = [
    {
      path: "/",
      element: < Home />,
    },
    {
      path: "/game/:roomCode",
      element: <Game />,
    },
    {
      path : "/create_account" , 
      element : <CreateAccount />
    }
];

export default routes;