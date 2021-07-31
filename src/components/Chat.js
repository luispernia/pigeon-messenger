import React from 'react'
import { io } from "socket.io-client";
import { useState } from 'react';

const socket = io("http://localhost:8080");

socket.on("connect", () => {
    console.log("connected");
});

socket.emit("ide", { dumb: "dummy" }, (res) => {
    console.log(res);
});

socket.on("createMessage", (arg) => {
    console.log(arg);
})

socket.on("listUsers", (res) => {
    console.log(res);
})

socket.on("privateMessage", (message) => {
    console.log(message);
})

function Chat() {
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);
    const [rooms, setRooms] = useState([])
    const [selectedRoom, setSelectedRoom] = useState("");
    const [room, setRoom] = useState("");
    const [to, setTo] = useState("");

    function handleChat() {
        socket.emit("joinChat", { name: user, room }, ({ roomUsers, myRooms }) => {
            console.log("Room Users", roomUsers);
            setRooms(myRooms);
        })
    }

    function handleMessage() {

        socket.emit("sendMessage", { message, room }, (res) => {
            console.log(res);
        });
    }

    function privateMessage() {
        socket.emit("privateMessage", { message, to }, (res) => {
            console.log(res);
        });
    }


    return (
        <>
            <input type="text" value={user} onChange={($event) => setUser($event.target.value)} placeholder="User" />
            <input type="text" value={message} onChange={($event) => setMessage($event.target.value)} placeholder="Message" />
            <input type="text" value={room} onChange={($event) => setRoom($event.target.value)} placeholder="Room" />
            <input type="text" value={to} onChange={($event) => setTo($event.target.value)} placeholder="To" />
            <select name="rooms" id="rooms" onChange={($event) => { setSelectedRoom($event.target.value) }}>
                <option value="" disabled>room</option>
                {rooms.map((e, i) => {
                    return <option key={i} value={e}>{e}</option>
                })}
            </select>
            <button onClick={handleChat}>Join Chat</button>
            <button onClick={handleMessage}>Send Message</button>
            <button onClick={privateMessage}>To</button>
        </>
    )
}

export default Chat