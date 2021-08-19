import React, { useContext, useEffect, useRef, useState } from 'react'
import roomsContext from '../services/context/RoomContext'
import userContext from '../services/context/UserContext';
import ChatBar from './ChatBar';
import LoadMessages from './LoadMessages';

function ChatView() {

    const { selected } = useContext(roomsContext);
    const chatRef = useRef("");



    return (
        <div ref={chatRef}  className="chat-view">
            <div className="chat-glass">
            
            {selected ? (selected.user_id ? <ContactView data={selected} chat={chatRef} /> : <RoomView data={selected} chat={chatRef} />) : <NotSelectedView chat={chatRef} />}
            {selected? <ChatBar  /> : ""}
   
            </div>
        </div>
    )
}

const ContactView = ({ data, chat }) => {

    const { chatPhotos, clearPhotos, photos } = useContext(roomsContext);

    const setPhotos = () => {
        if (photos.length === 0) {
            chatPhotos({ room_id: data.room_id });
        } else {
            clearPhotos();
        }
    }
    
    return (
        <LoadMessages height={chat.current.offsetHeight} />
    );
}

const RoomView = ({ data, chat }) => {

    const { chatPhotos, clearPhotos, photos } = useContext(roomsContext);
    
    const setPhotos = () => {
        if (photos.length === 0) {
            chatPhotos({ room_id: data.room_id });
        } else {
            clearPhotos();
        }
    }
    
    return (
        <LoadMessages height={chat.current.offsetHeight} />
    );
}

const NotSelectedView = ({ chat }) => {
    return (
        <div style={{ height: "100%" }} className="chat-glass">
            
        </div>
    )
}



export default ChatView
