import "./_Chat.scss"
import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import userContext from '../services/context/UserContext';
import axios from "axios";
import Docs from './Docs';
import socket from "../services/sockets/sockets";

function Chat() {

    const { user, updateUser } = useContext(userContext);

    const [message, setMessage] = useState("");
    const [rooms, setRooms] = useState([])
    const [selectedRoom, setSelectedRoom] = useState("");
    const [room, setRoom] = useState("");
    const [to, setTo] = useState("");

    function setSocketID(user) {

    }

    useEffect(() => {
        setSocketID(user);
    }, [])

    return (
        <>
            <div className="container">
                <div className="module">
                    <div className="box">
                        <h2>Rooms</h2>
                        <ul>
                            <li>Room 1</li>
                        </ul>
                    </div>

                    <div className="box">
                        <h2>Profile</h2>
                    </div>

                    <div className="box">
                        <h2>Contacts</h2>
                    </div>
                </div>
                <div className="module">
                    <div className="box">
                        <h2>Selected Room</h2>
                    </div>

                    <div className="box">
                        <h2>Notifications</h2>
                    </div>

                    <div className="box">
                        <h2>Selected Contact</h2>
                    </div>
                </div>

            </div>
            {/* <input type="text" value={user.username} readOnly placeholder="User" />
            <input type="text" value={message} onChange={($event) => setMessage($event.target.value)} placeholder="Message" />
            <input type="text" value={room} onChange={($event) => setRoom($event.target.value)} placeholder="Room" />
            <input type="text" value={to} onChange={($event) => setTo($event.target.value)} placeholder="To" />
            <select name="rooms" id="rooms" value={selectedRoom} onChange={($event) => { setSelectedRoom($event.target.value) }}>
                <option value="" disabled>room</option>
                {rooms.map((e, i) => {
                    return <option key={i} value={e}>{e}</option>
                })}
            </select>
            <button onClick={handleChat}>Join Chat</button>
            <button onClick={handleMessage}>Send Message</button>
            <button onClick={privateMessage}>To</button>
            <button onClick={sendContact}>Notify Contact</button>
            <Docs /> */}
        </>
    )
}

export default Chat