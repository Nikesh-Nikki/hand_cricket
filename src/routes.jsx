import React from "react";
import Form from "./components/Form.jsx";
import Game from "./components/Game.jsx";

const routes = [
    {
      path: "/",
      element: < Form />,
    },
    {
      path: "/game/:roomCode",
      element: <Game />,
    },
];

export default routes;