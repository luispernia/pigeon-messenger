import React, { useContext, useEffect, useRef } from 'react'
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
import ChatHeader from '../components/ChatHeader';
import ChatBar from '../components/ChatBar';
import FocusUI from '../components/FocusUI';


function Chat() {

    const { user, token } = useContext(userContext);
    const { addBell, refresh_bell } = useContext(bellsContext);
    const { refresh_rooms, roomMessages } = useContext(roomsContext);
    const chatRef = useRef(null);

    // const [message, setMessage] = useState("");
    // const [rooms, setRooms] = useState([]);
    // const [selectedRoom, setSelectedRoom] = useState("");
    // const [room, setRoom] = useState("");
    // const [to, setTo] = useState("");


    
    useEffect(() => {
        refresh_rooms();
        refresh_bell();
        handleClientId(token);  
        
        socket.on("notify", (args) => {
            addBell(args, ({ ring }) => {
                if (ring) {
                    let bell = new Audio("bell.wav");
                    bell.play();
                }
            });
        })  

        socket.on("onMessage", (args) => {
            roomMessages({ room_id: args.room });
        })

    }, [])


    return (
        <>

            <div className="container">
                <FocusUI />
                <div className="primary-column">
                    <Rooms />
                </div>

                <div className="principal-view">

                    <div className="principal-bar">
                        <Profile />
                        <ChatHeader />
                    </div>

                    <div ref={chatRef} className="chat-view">
                        <ChatView chat={chatRef} />    
                        <ChatBar  />
                    </div>

                </div>



                {/* <div className="module">
                    <Profile user={user} logout={logout} token={token} />
                    <Rooms />
                    <Contacts />
                </div>
                <ChatView />
                <div className="module" style={{ flex: "0 0 calc(30%)" }}>
                    <Notifications />
                </div> */}
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