import React, { useContext, useEffect, useState, useRef } from 'react'
import axios from "axios";
import roomsContext from '../services/context/RoomContext';
import userContext from '../services/context/UserContext';
import {roomSettings} from '../services/sockets/sockets';

function ChatHeader() {

    const [users, setUsers, setAlert] = useState([]);
    const {selected} = useContext(roomsContext)
    const {token, user} = useContext(userContext);
    const [onMouse, setOnMouse] = useState(false);
    const [onEdit, setOnEdit] = useState(true);
    const titleRef = useRef(null);
    const [title, setTitle] = useState(""); 

    const editTitle = () => {
        setOnEdit(!onEdit);
    }
    
    const saveEdit = () => {
        axios.put(`http://localhost:8080/room/${selected._id}/default`, {name: title}, {withCredentials: true})
        .then((res) => {
            roomSettings({type: "title", value: title, room_id: selected.room_id? selected.room_id : "", author: user }, (res) => {
                if(!res.ok) {
                    setAlert({show: true, text: res.err});
                }
                setOnEdit(!onEdit);
            });
        })
        .catch(err => {
            alert(err);
        }) 
        
    }
    
    useEffect(() => {
        if(selected) {
            setTitle(selected.name);
            setUsers(selected.members);
            if(selected.contact_id) {
                setUsers([]);
            }
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
                    {selected? (selected.contact_id? (
                        ""
                    ) : (<>
                            {users.map((e, i) => {
                                return <img key={i} src={`http://localhost:8080/upload/user/${e.img}?token=${token}`} alt={`${e.email}`} />
                            })}
                            <p>And 6+ people</p>
                        </>
                    )) : ("")}
                  
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
