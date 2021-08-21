import React, { useState, useContext, useRef } from 'react'
import { sendMessage } from "../services/sockets/sockets";
import userContext from '../services/context/UserContext';
import axios from "axios";
import roomsContext from '../services/context/RoomContext';

const ChatBar = () => {

    const [message, setMessage] = useState("");
    const [doc, setFile] = useState({ docs: [] });
    const { user } = useContext(userContext);
    const {selected} = useContext(roomsContext);
    const {room_id} = selected? selected : {room_id: ""};
    const fileRef = useRef(null);
    const [cursor, setCursor] = useState(false);
        
    const handleSubmit = async ($event) => {
        $event.preventDefault();

        if (doc.docs.length > 0) {
            let formData = new FormData();

            for (let file of doc.docs) {
                formData.append("docs", file);
            }

            formData.append("document", JSON.stringify({ author: user._id, msgDate: new Date(), room_id, text: message }));

            axios.post("http://localhost:8080/message/docs", formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            .then((res) => {
                sendMessage({ user, message: res.data.message, room: room_id, type: "docs"});
            })
            .catch(err => {
                alert(err);
            })

        } else {
            sendMessage({ user, message, room: room_id, type: "text" });
        }


    }

    return (
        <div className="bar-container">
            <form onSubmit={handleSubmit} className="send-bar">
                <div className="fileInput">
                    <i onClick={() => fileRef.current.click()} className="bi bi-images"></i>
                    <input ref={fileRef} onChange={($event) => setFile({ docs: [...doc.docs, ...$event.currentTarget.files] })} type="file" name="docs" multiple />
                </div>
                <input value={message} onChange={($event) => setMessage($event.target.value)} type="text" placeholder="Message" />
                <button onMouseOver={() => setCursor(true)} onMouseLeave={() => setCursor(false)} type="submit">{cursor? <i className="bi bi-cursor-fill"></i> : <i className="bi bi-cursor"></i>}</button>
            </form>
        </div>
    )
}

export default ChatBar
