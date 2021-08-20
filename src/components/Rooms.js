import React, { useContext, useEffect, useRef, useState } from 'react'
import roomsContext from '../services/context/RoomContext';
import userContext from '../services/context/UserContext';
import socket from "../services/sockets/socketConfig";
import { useSpring, animated } from "react-spring";
import messagesContext from '../services/context/MessagesContext';
import useWindowSize from './useWindowSize';
import Profile from './Profile';

function Rooms() {

    const { chats, chatPeeks } = useContext(roomsContext);
    const [width, height] = useWindowSize();
    const chatRef = useRef();

    return (
        <>
            <div className="bar-header">
                <PigeonLogo />
                {width <= 769? (
                    <Profile />
                ) : ("")}
            </div>
            <div className="chat-panel">
                <Create />
                <Search />
                <div ref={chatRef} className="chat-icons">                    
                    {chats.map((e,i) => {
                        return e.user_id ? <ContactIcon key={i} chatRef={chatRef} data={e} peeks={chatPeeks[e.room_id]} /> : <RoomIcon chatRef={chatRef} data={e} peeks={chatPeeks[e.room_id]} />
                    })}
                </div>
            </div>
        </>
    )
}

const ContactIcon = ({ data, peeks, chatRef }) => {

    const { contact_id } = data;
    const { token, user } = useContext(userContext);
    const { setSelectedChat, selected, unreaded, setReaded, setPeekMessages, refresh_rooms} = useContext(roomsContext);
    const contactRef = useRef(null);

    const selectedChat = (data) => {
        setReaded(data.room_id);
        setSelectedChat(data);
    }

    useEffect(() => {
        unreaded(data.room_id)
        socket.on("onMessage", (args) => {
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
        socket.on("onMessage", (args) => {
            if(args.message.global) {
                refresh_rooms(() => {}, true);
                unreaded(data.room_id);                
            } else {
                if(args.message.author.username !== user.username) {
                    refresh_rooms(() => {}, true);
                    unreaded(data.room_id);
                }
            }
            setPeekMessages(data.room_id);
            unreaded(data.room_id);
            chatRef.current.scrollTop = -999999;
        })
        chatRef.current.scrollTop = -999999;

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

const RoomIcon = ({ data, peeks, chatRef }) => {
    const { token, user } = useContext(userContext);
    const { setSelectedChat, selected, unreaded, setReaded, setPeekMessages, refresh_rooms} = useContext(roomsContext);
    const {clear_queue} = useContext(messagesContext);

    const roomRef = useRef(null);

    const selectedChat = (data) => {
        clear_queue();
        setReaded(data.room_id);
        setSelectedChat(data);
    }

    useEffect(() => {
        unreaded(data.room_id)
        socket.on("onMessage", (args) => {
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
        socket.on("onMessage", (args) => {
            if(args.message.global) {
                refresh_rooms(() => {}, true);
                unreaded(data.room_id)                
            } else {
                if(args.message.author.username !== user.username) {
                    unreaded(data.room_id)
                    refresh_rooms(() => {}, true);
                }
            }
            setPeekMessages(data.room_id);
            unreaded(data.room_id);
            chatRef.current.scrollTop = -999999;
        })
        chatRef.current.scrollTop = -999999;
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
            <animated.div className="chat-icon-body">
                <h4>{`${data.name}`}</h4>
                <div className="peek-messages">
                    {peeks.messages ? (
                        <PeekMessage message={peeks.messages[0]} />
                    ) : ("")}
                </div>
            </animated.div>
        </div>
    )

}

const PeekMessage = ({message}) => {

    const spring = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }})

    return (<>
        {message? (
            <animated.div style={spring} className="peek-message">
                {message.author? (
                    <p className="peek-author">{message.author.username}</p>

                ) : ("")}
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
    const [value, setValue] = useState("");
    const {searchRoom} = useContext(roomsContext);
    

    return (
        <div className="center-bar">
            <div onClick={() => { search.current.focus()}} value={value} onChange={($event) => {
                setValue($event.target.value);
                console.log($event.target.value);
                searchRoom($event.target.value);
            }} className="search-bar">
                <i className="bi bi-search"></i>
                <input ref={search} type="text" placeholder="Search Pigeon" />
            </div>
        </div>
    )
}

const Create = () => {

    const { setFocus, setShowBar, showBar } = useContext(roomsContext);

    return (
        <div className="bar">
            <h2>Chats</h2>
            <div className="bar-controls">
                <div className="create-room">
                    <i onClick={() => setFocus(true, "room")} className="bi bi-collection"></i>
                </div>
                <div className="add-contact">
                    <i onClick={() => setFocus(true, "request")} className="bi bi-person-plus"></i>
                </div>
            </div>
        </div>
    )
}

export default Rooms
