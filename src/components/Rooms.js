import "./_Rooms.scss";
import React, { useContext, useEffect, useState } from 'react'
import roomsContext from '../services/context/RoomContext';
import userContext from '../services/context/UserContext';
import socket from "../services/sockets/socketConfig";

function Rooms() {

    const { chats } = useContext(roomsContext);

    return (
        <div className="box rooms">
            <h2>Chats</h2>
            <div className="list">
                {chats.map(e => {
                    return e.user_id ? <ContactIcon data={e} /> : <RoomIcon data={e} />
                })}
            </div>
        </div>
    )
}

const ContactIcon = ({ data }) => {

    const { contact_id } = data;
    const { token } = useContext(userContext);
    const { setSelectedChat } = useContext(roomsContext);

    const selectedChat = (data) => {
        setSelectedChat(data);
        console.log("asd")
    }

    return (
        <div onClick={() => selectedChat(data)} className="chat_icon">
            <img src={`http://localhost:8080/upload/user/${contact_id.img}?token=${token}`} alt={`${contact_id.name}`} />
            <p>@{contact_id.username}</p>
        </div>
    )
}

const RoomIcon = ({ data }) => {
    const { name } = data;
    const { token } = useContext(userContext);
    const { setSelectedChat, selected } = useContext(roomsContext);
    const [bells, setBells] = useState(0);

    const selectedChat = (data) => {
        setBells(0);
        setSelectedChat(data);
    }

    useEffect(() => {
        socket.on("onMessage", (args) => {
            if (args.room === data.room_id) {
                if (selected) {
                    console.log(selected);
                    console.log(data.room_id === selected.room_id);
                    if (data.room_id === selected.room_id) {
                        console.log("Equal");
                        setBells(0);
                    } else {
                        setBells(bells + 1);
                    }
                } else {
                    setBells(bells + 1);
                }
            }
        })
    }, [selected])

    return (
        <div onClick={() => selectedChat(data)} className="chat_icon">
            <p>{bells}</p>
            <img src={`http://localhost:8080/upload/user/default.png?token=${token}`} alt={`${name}`} />
            <p>{name}</p>
        </div>
    )

}

export default Rooms
