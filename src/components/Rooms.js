import React, { useState, useEffect } from 'react'
import "./_Rooms.scss";
import axios from "axios";

function Rooms() {

    const [roomName, setRoomName] = useState("");

    function handleOnSubmit($event) {
        $event.preventDefault();



    }

    return (
        <div className="box rooms">
            <h2>Rooms</h2>
            <div className="list">
              
            </div>
        </div>
    )
}

export default Rooms
