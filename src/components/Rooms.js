import React, { useContext, useEffect, useRef, useState } from 'react'
import roomsContext from '../services/context/RoomContext';
import userContext from '../services/context/UserContext';
import socket from "../services/sockets/socketConfig";
import { useSpring, animated } from "react-spring";

function Rooms() {

    const { chats, chatPeeks } = useContext(roomsContext);



    return (
        <>
            <PigeonLogo />
            <div className="chat-panel">
                <Create />
                <Search />
                <div className="chat-icons">
                    {chats.map((e,i) => {
                        return e.user_id ? <ContactIcon key={i} data={e} peeks={chatPeeks[e.room_id]} /> : <RoomIcon data={e} peeks={chatPeeks[e.room_id]} />
                    })}
                </div>
            </div>
        </>
    )
}

const ContactIcon = ({ data, peeks }) => {

    const { contact_id } = data;
    const { token } = useContext(userContext);
    const { setSelectedChat, selected, unreaded, setReaded, setPeekMessages, updatePeek } = useContext(roomsContext);
    const contactRef = useRef(null);

    const selectedChat = (data) => {

        setReaded(data.room_id);
        setSelectedChat(data);
    }

    useEffect(() => {
        unreaded(data.room_id)
        socket.on("onMessage", (args) => {
            setPeekMessages(data.room_id);
            unreaded(data.room_id)
            if (args.room === data.room_id) {
                if (selected) {
                    if (data.room_id === selected.room_id) {
                    }
                } else {

                }
            }
        })
    }, [selected])

    useEffect(() => {

    }, [])

    return (
        <div ref={contactRef} onClick={() => selectedChat(data)} className={`chat-icon ${ selected? ( data.room_id === selected.room_id? "chat-selected" : "") : ""}`}>
            <div className="chat-icon-img">
                {peeks.bells === 0 ? ("") : (
                    <p className="bells-peek">
                        {peeks.bells}
                    </p>
                )}
                <img src={`http://localhost:8080/upload/user/${contact_id.img}?token=${token}`} alt={`${contact_id.name} img`} />
            </div>
            <div className="chat-icon-body">
                <h4>{`${contact_id.username}`}</h4>
                <p className={`icon-online ${peeks.online ? "" : "offline"} `}>{peeks.online ? "Online" : "Offline"}</p>
                {peeks.messages ? (
                        <PeekMessage message={peeks.messages[0]} />
                    ) : ("")}
            </div>
        </div>
    )
}

const RoomIcon = ({ data, peeks }) => {
    const { token } = useContext(userContext);
    const { setSelectedChat, selected, unreaded, setReaded, setPeekMessages, updatePeek} = useContext(roomsContext);
    const roomRef = useRef(null);

    const selectedChat = (data) => {
        setReaded(data.room_id);
        setSelectedChat(data);
    }

    useEffect(() => {
        unreaded(data.room_id);
        socket.on("onMessage", (args) => {
            setPeekMessages(data.room_id);
            unreaded(data.room_id);
            if (args.room === data.room_id) {
                    
                if (selected) {
                    if (data.room_id === selected.room_id) {

                    }
                } else {

                }
            }
        })
    }, [selected])

    useEffect(() => {

    }, [])

    return (
        <div ref={roomRef}  onClick={() => selectedChat(data)} className="chat-icon" style={selected? (data.room_id === selected.room_id? {backgroundColor: "var(--dark-secondary)"} : {}) : ({})}   >
            <div className="chat-icon-img">
                {peeks.bells === 0 ? ("") : (
                    <p className="bells-peek">
                        {peeks.bells}
                    </p>
                )}
                <img src={`http://localhost:8080/upload/room/${data.img}?token=${token}`} alt={`${data.name} img`} />
            </div>
            <div className="chat-icon-body">
                <h4>{`${data.name}`}</h4>
                <div className="peek-messages">
                    {peeks.messages ? (
                        <PeekMessage message={peeks.messages[0]} />
                    ) : ("")}
                </div>
            </div>
        </div>
    )

}

const PeekMessage = ({ message}) => {

    const spring = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }})

    return (<>
        {message? (
            <animated.div style={spring} className="peek-message">
            <p className="peek-author">{message.author.username}</p>
            <p>{message.text.slice(0, 15)}{message.text.length >= 15? "..." : ""}</p>
        </animated.div>
        ) : ("")}
    </>)


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
            <div onClick={() => { search.current.focus() }} className="search-bar">
                <i class="bi bi-search"></i>
                <input ref={search} type="text" placeholder="Search Pigeon" />
            </div>
        </div>
    )
}

const Create = () => {

    const { setFocus } = useContext(roomsContext);

    return (
        <div className="bar">
            <h2>Chats</h2>
            <div className="bar-controls">
                <div className="create-room">
                    <i onClick={() => setFocus(true, "room")} class="bi bi-collection"></i>
                </div>
                <div className="add-contact">
                    <i onClick={() => setFocus(true, "request")} class="bi bi-person-plus"></i>
                </div>
            </div>
        </div>
    )
}

export default Rooms
