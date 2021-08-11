import React, { useContext, useEffect, useState } from 'react'
import roomsContext from '../services/context/RoomContext'
import userContext from '../services/context/UserContext';
import ChatPhotos from "./ChatPhotos";
import ChatBar from './ChatBar';
import Message from "./Message";

function ChatView({chat}) {

    const { selected } = useContext(roomsContext);


    return selected ? (selected.user_id ? <ContactView data={selected} /> : <RoomView data={selected} chat={chat} />) : <NotSelectedView />
}

const ContactView = ({ data }) => {

    const { token } = useContext(userContext);

    return (
        <div className="chat">
            <div className="chat_header">
                <div className="chat-info">
                    <img src={`http://localhost:8080/upload/user/default.png?token=${token}`} alt={`data.name`} />
                    <p>@{data.contact_id.username}</p>
                </div>
                <div className="controls">

                </div>
            </div>
        </div>
    );
}

const RoomView = ({ data , chat }) => {

    const { token } = useContext(userContext);
    const { chatPhotos, clearPhotos, photos, roomMessages, selected, messages } = useContext(roomsContext);

    const setPhotos = () => {
        if (photos.length === 0) {
            chatPhotos({ room_id: data.room_id });
        } else {
            clearPhotos();
        }
    }

    useEffect(() => {
        roomMessages({ room_id: data.room_id });
    }, [selected])
    
    return (
        <div className="chat-glass">
            <div style={{maxHeight: chat.current.offsetHeight}} className="messages">
                {messages.map(e => {
                    return <Message data={e} />
                })}
                <ChatBar room_id={data.room_id} />
            </div>
        </div>
    );
}

const NotSelectedView = () => {
    return (
        <div className="no-selected-chat">
            <p>Not selected 😓</p>
        </div>
    )
}



export default ChatView
