import React, { useContext, useEffect, useRef, useState } from 'react'
import roomsContext from '../services/context/RoomContext'
import userContext from '../services/context/UserContext';
import ChatBar from './ChatBar';
import Message from "./Message";

function ChatView() {

    const {token} = useContext(userContext);
    const { selected } = useContext(roomsContext);
    const chatRef = useRef("");



    return (
        <div ref={chatRef} style={selected? {backgroundImage: `url(http://localhost:8080/upload/room/${selected.img}?token=${token})`} : {}} className="chat-view">
            {selected ? (selected.user_id ? <ContactView data={selected} chat={chatRef} /> : <RoomView data={selected} chat={chatRef} />) : <NotSelectedView chat={chatRef} />}
            <ChatBar  />
        </div>
    )
}

const ContactView = ({ data, chat }) => {

    const { token } = useContext(userContext);
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
        roomMessages({ room_id: data.room_id });
        (() => {
            messagesRef.current.scroll(0, 1000000000);
        })();
    }, [selected])

    return (
        <div className="chat-glass">
            <div ref={messagesRef} style={{ maxHeight: chat.current.offsetHeight }} className="messages">
                {messages.map(e => {
                    return <Message data={e} />
                })}
            </div>
        </div>
    );
}

const RoomView = ({ data, chat }) => {

    const { token } = useContext(userContext);
    const { chatPhotos, clearPhotos, photos, roomMessages, selected, messages } = useContext(roomsContext);
    const messagesRef = useRef(null);
    let [state, setState] = useState(false);

    const setPhotos = () => {
        if (photos.length === 0) {
            chatPhotos({ room_id: data.room_id });
        } else {
            clearPhotos();
        }
    }

    useEffect(() => {
        roomMessages({ room_id: data.room_id });
        (() => {
            messagesRef.current.scroll(0, 1000000000);
        })();
    }, [selected])

    return (
        <div className="chat-glass">
            <div ref={messagesRef} style={{ maxHeight: chat.current.offsetHeight }} className="messages">

                {messages.map(e => {
                   return <Message data={e} />
                })}
            </div>
        </div>
    );
}

const NotSelectedView = ({ chat }) => {
    return (
        <div style={{ height: "100%" }} className="chat-glass">
            <h2 className="empty">Chat empty</h2>
        </div>
    )
}



export default ChatView
