import React, { useContext, useRef  } from 'react'
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
    return (
        <div style={{ height: "100%" }} className="chat-glass">
            
        </div>
    )
}



export default ChatView
