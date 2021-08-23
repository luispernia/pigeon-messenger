/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useRef, useEffect } from 'react'
import { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import roomsContext from '../services/context/RoomContext'
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
    
    return (
        <LoadMessages height={chat.current.offsetHeight} />
    );
}

const RoomView = ({ data, chat }) => {
    
    return (
        <LoadMessages height={chat.current.offsetHeight} />
    );
}

const NotSelectedView = ({ chat }) => {

    const [reset, setReset] = useState(false);
    const [selected, setSelected] = useState(0);
    const spring = useSpring({to: {opacity: 1}, from: {opacity: 0}, delay: 500, reset: reset});

    const opts = [
    <h1 className="empty">Use the <span><i class="bi bi-person-plus"></i></span> for add people</h1>,
    <h1 className="empty">Create a room with <span><i class="bi bi-collection"></i></span></h1>,
    <h1 className="empty">Update your photo on settings <span><i class="bi bi-box"></i></span></h1>
    ]

    useEffect(() => {
        setInterval(() => {
            setSelected(Math.floor(Math.random() * opts.length));
            setReset(true);
            setTimeout(() => {
                setReset(false);
            }, 500);
        }, 10000)
    }, [])

    return (
        <animated.div style={{...spring, height: "100%" }} className="chat-glass">
            {opts[selected]}
        </animated.div>
    )
}



export default ChatView
