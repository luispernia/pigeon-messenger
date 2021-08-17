import React, { useContext, useEffect, useState, useRef } from 'react'
import roomsContext from '../services/context/RoomContext';
import axios from "axios";
import userContext from '../services/context/UserContext';

function ChatHeader() {

    const [users, setUsers] = useState([]);
    const {selected} = useContext(roomsContext)
    const {token} = useContext(userContext);
    const [onMouse, setOnMouse] = useState(false);
    const [onEdit, setOnEdit] = useState(true);
    const titleRef = useRef(null);
    const [title, setTitle] = useState(""); 

    const editTitle = () => {
        setOnEdit(!onEdit);
    }

    const saveEdit = () => {
        
    }

    useEffect(() => {
        if(selected) {
            setTitle(selected.name);
            setUsers(selected.members);
        } else {
            setTitle("");
        }

        setOnEdit(true);

    }, [selected])
    
    
    useEffect(() => {
        if(onEdit === false) {
            titleRef.current.focus();
        }



    }, [onEdit])

    return (
        <div className="chat-header">
            <div className="chat-title">
                <div onMouseLeave={() => {setOnMouse(false)}} onMouseOver={() => { setOnMouse(true) }} className="chat-name">
                    <input ref={titleRef} className="chat-title" type="text" value={selected? title : ""} onChange={($event) => setTitle($event.target.value)} disabled={onEdit} />
                    <i onClick={() => {
                        if(!onEdit) {
                            saveEdit();
                        } else{ 
                            editTitle();
                        }
                        }} style={ onMouse? {display: "flex"} : {display: "none"}} class={`bi bi-${onEdit? "pencil-square" : "check2-circle"}`}></i>
                </div>
                <div className="members">
                    {users.map(e => {
                        return <img src={`http://localhost:8080/upload/user/${e.img}?token=${token}`} alt={`${e.email}`} />
                    })}
                    <p>And 6+ people</p>
                </div>
            </div>
            <div className="chat-opts">
                <div className="opts-container">
                    <i class="bi bi-plus-circle-dotted"></i>
                    <i class="bi bi-archive"></i>

                </div>
            </div>
        </div>
    )
}

export default ChatHeader
