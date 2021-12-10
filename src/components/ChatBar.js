/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useRef, useEffect } from 'react'
import { sendMessage } from "../services/sockets/sockets";
import userContext from '../services/context/UserContext';
import axios from "axios";
import roomsContext from '../services/context/RoomContext';
import {api} from "../services/config";
import {useCookies} from "react-cookie"
import { useSpring, animated } from 'react-spring';

const ChatBar = () => {

    const [message, setMessage] = useState("");
    const [cookies] = useCookies(["token"]);
    const [doc, setFile] = useState({ docs: [] });
    const { user, setAlert } = useContext(userContext);
    const { selected } = useContext(roomsContext);
    const { room_id } = selected ? selected : { room_id: "" };
    const fileRef = useRef(null);
    const [cursor, setCursor] = useState(false);
    const [photos, setPhotos] = useState([]);
    

    const handleSubmit = async ($event) => {
        $event.preventDefault();

        if (doc.docs.length > 0) {
            let formData = new FormData();

            for (let file of doc.docs) {
                formData.append("docs", file);
            }

            formData.append("document", JSON.stringify({ author: user._id, msgDate: new Date(), room_id, text: message }));

            axios.post(`${api}/message/docs`, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": cookies.token
                }
            })

                .then((res) => {
                    sendMessage({ user, message: res.data.message, room: room_id, type: "docs" });
                    setFile({ docs: [] });
                    setPhotos([]);
                    setMessage("");

                })                
                .catch(err => {
                    alert(err);
                })

        } else {
            sendMessage({ user, message, room: room_id, type: "text" });
            setMessage("");

        }


    }

    useEffect(() => {
        if(photos.length > 7) {
            setAlert({text: "Need to be less than 7 photos"});
        }
    },[photos])

    return (    
        <div className="bar-container">
            {photos.length > 0 ? (
                <Uploads files={photos} />
            ) : (
                ""
            )}
            <form onSubmit={handleSubmit} className="send-bar">
                <div onClick={() => fileRef.current.click()} className="fileInput">
                    <i className="bi bi-images"></i>
                    <input ref={fileRef} onChange={($event) => {
                        setFile({ docs: [...doc.docs, ...$event.currentTarget.files] })
                        setPhotos([...$event.currentTarget.files].map(e => {
                            return URL.createObjectURL(e);
                        }))
                    }

                        } type="file" name="docs" multiple />
                </div>
                <input value={message} accept=".png,.jpg,.jpge" onChange={($event) => setMessage($event.target.value)} type="text" placeholder="Message" />
                <button onMouseOver={() => setCursor(true)} onMouseLeave={() => setCursor(false)} type="submit" disabled={message.length <= 0 || doc.docs.length > 7}>{cursor ? <i className="bi bi-cursor-fill"></i> : <i className="bi bi-cursor"></i>}</button>
            </form>
        </div>
    )
}

const Uploads = ({ files }) => {

    const [photos, setPhotos] = useState([]);
    const spring = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 200 });

    useEffect(() => {
        setPhotos(files);
    }, [files])

    return (
        <>
            <animated.div style={spring} className="uploads-content">
                {photos.slice(0,7).map(e => {
                    return (
                    <div className="img-content">
                        <img src={e} alt="img" />
                    </div>
                    )
                })}
            </animated.div>
        </>
    )
}


export default ChatBar
