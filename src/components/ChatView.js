import "./_ChatView.scss"
import "./_Message.scss"
import React, { useContext, useEffect, useState } from 'react'
import roomsContext from '../services/context/RoomContext'
import userContext from '../services/context/UserContext';
import ChatPhotos from "./ChatPhotos";
import Message from "./Message";
import { sendMessage } from "../services/sockets/sockets";
import axios from "axios";

function ChatView() {

    const { selected } = useContext(roomsContext);


    return selected ? (selected.user_id ? <ContactView data={selected} /> : <RoomView data={selected} />) : <NotSelectedView />
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

const RoomView = ({ data }) => {

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
        <div className="chat">
            <div className="chat_header">
                <div className="chat-info">
                    <img src={`http://localhost:8080/upload/user/default.png?token=${token}`} alt={`data.name`} />
                    <p>{data.name}</p>
                </div>
                <div className="controls">
                    <button onClick={() => setPhotos()} className="button">photos</button>
                </div>
            </div>
            {photos.length > 0 ? <ChatPhotos photos={photos} /> : ""}
            <div className="messages">
                {messages.map(e => {
                    return <Message data={e} />
                })}
                <ChatControls room_id={data.room_id} />
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

const ChatControls = ({ room_id }) => {

    const [message, setMessage] = useState("");
    const [doc, setFile] = useState({ docs: [] });
    const { user } = useContext(userContext);

    const handleSubmit = async ($event) => {
        $event.preventDefault();
        console.log(doc.docs.length);
        if (doc.docs.length > 0) {
            let formData = new FormData();
            for (let file of doc.docs) {
                formData.append("docs", file);
            }

            formData.append("document", JSON.stringify({ author: user._id, msgDate: new Date(), room_id, text: message }));

            let res = await axios.post("http://localhost:8080/message/docs", formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).catch(err => {
                alert(err);
            })
            
            sendMessage({ user, message, room: room_id, type: "docs" });
        } else {
            sendMessage({ user, message, room: room_id, type: "text" });
        }


    }

    return (
        <form onSubmit={handleSubmit}>
            <input onChange={($event) => setFile({ docs: [...doc.docs, ...$event.currentTarget.files] })} type="file" name="docs" multiple />
            <input value={message} onChange={($event) => setMessage($event.target.value)} type="text" placeholder="Message" />
            <button type="submit">Send</button>
        </form>
    )
}

export default ChatView
