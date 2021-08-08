import "./_Chat.scss"
import React, { useContext, useEffect } from 'react'
import { useHistory } from "react-router";
import { handleClientId } from "../services/sockets/sockets";

import userContext from '../services/context/UserContext';
import bellsContext from '../services/context/BellContext';
import roomsContext from "../services/context/RoomContext";

import Docs from '../components/Docs';
import socket from "../services/sockets/socketConfig";
import ChatView from "../components/ChatView";
import Profile from "../components/Profile";
import Rooms from "../components/Rooms";
import Contacts from "../components/Contacts";
import Notifications from "../components/Notifications";

import axios from "axios";


function Chat() {

    const history = useHistory();
    const { user, token, signOut } = useContext(userContext);
    const { addBell, refresh_bell } = useContext(bellsContext);
    const {refresh_rooms} = useContext(roomsContext);

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
            addBell(args, ({ring}) => {
                if(ring) {
                    let bell = new Audio("bell.wav");
                    bell.play();
                }
            });
        })
        
        refresh_bell();
        refresh_rooms();
    }, [])

    return (
        <>

            <div className="container">
                <div className="module">
                    <Profile user={user} logout={logout} token={token} />
                    <Rooms />
                    <Contacts />
                </div>
                  <ChatView />
                <div className="module" style={{flex: "0 0 calc(30%)"}}>
                    <Notifications />
                </div>
            </div>

            <footer>
                <p>Pigeon Messenger <b>Technical View</b> </p>
            </footer>

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