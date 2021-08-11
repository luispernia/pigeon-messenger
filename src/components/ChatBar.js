import React, {useState, useContext} from 'react'
import { sendMessage } from "../services/sockets/sockets";
import userContext from '../services/context/UserContext';
import axios from "axios";

const ChatBar = ({ room_id }) => {

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
        <form onSubmit={handleSubmit} className="send-bar">
            <input onChange={($event) => setFile({ docs: [...doc.docs, ...$event.currentTarget.files] })} type="file" name="docs" multiple />
            <input value={message} onChange={($event) => setMessage($event.target.value)} type="text" placeholder="Message" />
            <button type="submit">Send</button>
        </form>
    )
}

export default ChatBar
