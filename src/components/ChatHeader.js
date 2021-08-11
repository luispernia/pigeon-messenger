import React, { useContext, useEffect, useRef, useState } from 'react'
import roomsContext from '../services/context/RoomContext';

function ChatHeader() {

    let [users, setUsers] = useState([]);
    let {selected} = useContext(roomsContext)
    let [onMouse, setOnMouse] = useState(false);

    useEffect(() => {
        fetch("https://reqres.in/api/users?page=2")
            .then(res => res.json())
            .then(res => {
                res.data.pop();
                setUsers(res.data);
            })
    }, [])

    return (
        <div className="chat-header">
            <div className="chat-title">
                <div onMouseLeave={() => {setOnMouse(false)}} onMouseOver={() => { setOnMouse(true) }} className="chat-name">
                    <input type="text" value={selected? selected.name : ""} />
                    <i style={ onMouse? {display: "flex"} : {display: "none"}} class="bi bi-pencil-square"></i>
                </div>
                <div className="members">
                    {users.map(e => {
                        return <img src={e.avatar} alt={`${e.email}`} />
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
