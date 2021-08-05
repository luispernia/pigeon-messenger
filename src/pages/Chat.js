import "./_Chat.scss"
import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import userContext from '../services/context/UserContext';
import { useHistory } from "react-router";
import Profile from "../components/Profile";
import Rooms from "../components/Rooms";
import Contacts from "../components/Contacts";
import Notifications from "../components/Notifications";
import axios from "axios";
import Docs from '../components/Docs';
import {handleClientId} from "../services/sockets/sockets";
import socket from "../services/sockets/socketConfig";
import bellsContext from '../services/context/BellContext';


function Chat() {

    const { user, token, signOut } = useContext(userContext);
    const history = useHistory();
    const { addBell } = useContext(bellsContext);




    // const [message, setMessage] = useState("");
    // const [rooms, setRooms] = useState([]);
    // const [selectedRoom, setSelectedRoom] = useState("");
    // const [room, setRoom] = useState("");
    // const [to, setTo] = useState("");

    const logout = async (user) => {
        signOut(() => {
            alert("Bye");
            history.replace("/");
        })
    }

    useEffect(() => {
        handleClientId(user); 
        socket.on("notify", (args) => {
            addBell(args, () => {
                console.log(args);
            });
        })
    }, [])

    return (
        <>
            
            <div className="container">
                <div className="module">
                    <Rooms />
                    <Profile user={user} logout={logout} token={token} />
                    <Contacts/>                
                </div>
                <div className="module">
                    <div className="box">
                        <h2>Selected Room</h2>
                    </div>

                <Notifications />

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