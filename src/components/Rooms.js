import React, { useContext, useEffect, useRef, useState } from 'react'
import roomsContext from '../services/context/RoomContext';
import userContext from '../services/context/UserContext';
import socket from "../services/sockets/socketConfig";

function Rooms() {

    const { chats } = useContext(roomsContext);

    return (
        <>
            <PigeonLogo />
            <div className="chat-panel">
                <Search />
                <div className="chat-icons">
                    {chats.map(e => {
                        return e.user_id ? <ContactIcon data={e} /> : <RoomIcon data={e} />
                    })}
                </div>
            </div>
        </>
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
        <div onClick={() => selectedChat(data)} className="chat-icon">
            <div className="chat-icon-img">
                <p>{ }</p>
                <img src={`http://localhost:8080/upload/user/${contact_id.img}?token=${token}`} alt={`${contact_id.name} img`} />
            </div>
            <div className="chat-icon-body">
                <h4>{`${contact_id.username}`}</h4>
                <p className="chat-peek"><span>You:</span> What's up?</p>
                <p className="chat-peek"><span>Michael:</span> All good :D</p>
            </div>
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

        <div onClick={() => selectedChat(data)} className="chat-icon">
            <div className="chat-icon-img">
                <p className="bells-peek">
                    2
                </p>
                <img src={`http://localhost:8080/upload/user/${data.img}?token=${token}`} alt={`${data.name} img`} />
            </div>
            <div className="chat-icon-body">
                <h4>{`${data.name}`}</h4>
                <p className="chat-peek"><span>You:</span> What's up?</p>
                <p className="chat-peek"><span>Michael:</span> All good :D</p>
            </div>
        </div>

    )

}

const PigeonLogo = () => {
    return (
        <div className="pigeon">
            <h1> <span>Pigeon</span> Messenger</h1>
            <p> <span>Beta</span> v1.0.0</p>
        </div>
    )
}

const Search = () => {

    const search = useRef();

    return (
        <div className="center-bar">
            <div onClick={() => {search.current.focus()}} className="search-bar">
                <i class="bi bi-search"></i>
                <input ref={search} type="text" placeholder="Search Pigeon" />
            </div>
        </div>
    )
}

export default Rooms
