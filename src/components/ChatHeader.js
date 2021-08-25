import React, { useContext, useEffect, useState, useRef } from 'react'
import axios from "axios";
import roomsContext from '../services/context/RoomContext';
import userContext from '../services/context/UserContext';
import { roomSettings } from '../services/sockets/sockets';
import useWindowSize from './useWindowSize';
import { useCookies } from 'react-cookie';
import {api} from "../services/config";

function ChatHeader() {

    const [users, setUsers] = useState([]);
    const [cookies] = useCookies(["token"]);
    const { selected, setFocus, showBar, setShowBar } = useContext(roomsContext)
    const { token, user, setAlert } = useContext(userContext);
    const [onMouse, setOnMouse] = useState(false);
    const [onEdit, setOnEdit] = useState(true);
    const titleRef = useRef(null);
    const [title, setTitle] = useState("");

    const editTitle = () => {
        setOnEdit(!onEdit);
    }

    const [width] = useWindowSize();

    const saveEdit = () => {
        axios.put(`${api}/room/${selected._id}/default`, { name: title }, { withCredentials: true, headers: {"Authorization": cookies.token} })
            .then((res) => {
                roomSettings({ type: "title", value: title, room_id: selected.room_id ? selected.room_id : "", author: user }, (res) => {

                    if (!res.ok) {
                        setAlert({ show: true, text: res.err });
                    }

                    setOnEdit(!onEdit);
                });
            })
            .catch(err => {
                alert(err);
            })

    }

    useEffect(() => {
        if (selected) {
            setTitle(selected.name);
            setUsers(selected.members);
            if (selected.contact_id) {
                setUsers([]);
            }
        } else {
            setTitle("");
        }
        setOnEdit(true);

    }, [selected])


    useEffect(() => {
        if (onEdit === false) {
            titleRef.current.focus();
        }



    }, [onEdit])

    return (
        <>
            {selected ? (
                <div className="chat-header">
                    <i onClick={() => setShowBar({ reverse: !showBar.reverse })} className="bi bi-back open-bar"></i>
                    {selected.contact_id ? (
                        <div className="contact_header">
                            <img src={`${api}/upload/user/${selected.contact_id.img}?token=${token}`} alt={`${selected.contact_id.username}`} />
                            <div className="contact_text">
                                <h3>{selected.contact_id.username}</h3>
                                <p>{selected.contact_id.online ? "Online" : "Offline"}</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="chat-title">
                            <div className="chat-img">
                                        <img src={`${api}/upload/room/${selected.img}?token=${token}`} alt={`${selected.name} img`} />
                                    </div>
                                <div onMouseLeave={() => { setOnMouse(false) }} onMouseOver={() => { setOnMouse(true) }} className="chat-name">
                                    <div className="title-content">
                                    <i onClick={() => {
                                        if (!onEdit) {
                                            saveEdit();
                                        } else {
                                            editTitle();
                                        }
                                    }} style={onMouse ? { display: "flex" } : { display: "none" }} className={`bi bi-${onEdit ? "pencil-square" : "check2-circle"}`}></i>
                                    <input ref={titleRef} className="chat-title" type="text" value={selected ? title : ""} onChange={($event) => setTitle($event.target.value)} disabled={onEdit} />
                                    </div>
                                    <div className="members">
                                    {selected ? (selected.contact_id ? (
                                        ""
                                    ) : (<>
                                        {users.slice(0, 7).map((e, i) => {
                                            return <img key={i} src={`${api}/upload/user/${e.img}?token=${token}`} alt={`${e.email}`} />
                                        })}
                                        <p>{users.length > 7 ? `and ${users.length - 7} members` : "Members"}</p>
                                    </>
                                    )) : ("")}

                                </div>
                                </div>
                      
                            </div>

                            <div className="chat-opts">
                                <div className="opts-container">
                                    <i onClick={() => setFocus(true, "add-member")} className="bi bi-plus-circle-dotted"></i>
                                    {width <= 430 ? (
                                        ""
                                    ) : (
                                        // <i className="bi bi-archive"></i>
                                        ""
                                    )}
                                </div>
                            </div>
                        </>
                    )}


                </div>
            ) : (
                ""
            )
            }
        </>
    )
}

export default ChatHeader
