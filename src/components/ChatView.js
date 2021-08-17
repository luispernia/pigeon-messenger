import React, { useContext, useEffect, useRef } from 'react'
import roomsContext from '../services/context/RoomContext'
import userContext from '../services/context/UserContext';
import ChatBar from './ChatBar';
import Message from "./Message";

function ChatView() {

    const {token} = useContext(userContext);
    const { selected } = useContext(roomsContext);
    const chatRef = useRef("");

    return (
        <div ref={chatRef}  className="chat-view">
            <div className="chat-glass">
            {selected ? (selected.user_id ? <ContactView data={selected} chat={chatRef} /> : <RoomView data={selected} chat={chatRef} />) : <NotSelectedView chat={chatRef} />}
            <ChatBar  />
            </div>
        </div>
    )
}

const ContactView = ({ data, chat }) => {

    const { chatPhotos, clearPhotos, photos, roomMessages, selected, messages } = useContext(roomsContext);
    const messagesRef = useRef(null);

    const setPhotos = () => {
        if (photos.length === 0) {
            chatPhotos({ room_id: data.room_id });
        } else {
            clearPhotos();
        }
    }

    useEffect(() => {
        console.log(data);
        roomMessages({ room_id: data.room_id });
        (() => {
            messagesRef.current.scroll(0, 1000000000);
        })();
    }, [selected])

    return (
            <div ref={messagesRef} style={{ maxHeight: chat.current.offsetHeight }} className="messages">
               <div className="messages-overflow">
                    {messages.map((e,i) => {
                    return <Message key={i} data={e} />
                    })}
                </div>
            </div>
    );
}

const RoomView = ({ data, chat }) => {

    const { chatPhotos, clearPhotos, photos, roomMessages, selected, messages } = useContext(roomsContext);
    const messagesRef = useRef(null);

    const setPhotos = () => {
        if (photos.length === 0) {
            chatPhotos({ room_id: data.room_id });
        } else {
            clearPhotos();
        }
    }

    useEffect(() => {
        console.log(data);
        roomMessages({ room_id: data.room_id });
        (() => {
            messagesRef.current.scroll(0, 1000000000);
        })();
    }, [selected])

    return (
            <div ref={messagesRef} style={{ maxHeight: chat.current.offsetHeight }}  className="messages">
                <div className="messages-overflow">
                    {messages.map((e,i) => {
                    return <Message key={i} data={e} />
                    })}
                </div>
            </div>
    );
}

const NotSelectedView = ({ chat }) => {
    return (
        <div style={{ height: "100%" }} className="chat-glass">
            
        </div>
    )
}



export default ChatView
