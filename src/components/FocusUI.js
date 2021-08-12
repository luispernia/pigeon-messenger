import React, { useContext, useEffect, useRef, useState } from 'react'
import roomsContext from '../services/context/RoomContext'
import userContext from "../services/context/UserContext";
import { useSpring, animated } from "react-spring"

function FocusUI() {

    const props = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } })

    let { focus, setFocus, chats } = useContext(roomsContext);


    return (
        <>
            {focus.bool ? (
                <div style={props} className="focus">
                    <div onClick={() => setFocus(false)} className="close">
                        <i class="bi bi-x-circle"></i>
                    </div>
                    <div className="glass">
                        {focus.type === "room" ? (
                            <CreateRoom chats={chats} />
                        ) : ("")}
                    </div>
                </div>

            ) : ("")}
        </>
    )
}

const CreateRoom = ({ chats }) => {

    const imageRef = useRef(null);
    const { token } = useContext(userContext);
    const [members, setMembers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [state, setState] = useState(false);

    const opac = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 200 });
    const height = useSpring({ to: { height: 400 }, from: { height: 0 }, delay: 500 });
    const width = useSpring({ to: { width: 250 }, from: { width: 0 }, delay: 1000 });
    const show = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1200 });
    const showButton = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1200 });


    const addMember = (e) => {
        let index = members.findIndex(x => x.contact_id.username === e.contact_id.username);
        if (index < 0) {
            setMembers([...members, ...[{ ...e, clicked: state }]]);
        } else {
            let deleteMember = members.filter(r => r.contact_id.username !== e.contact_id.username);
            setMembers(deleteMember);
        }
    }

    useEffect(() => {
        setContacts(chats);
    }, [])

    return (
        <>
            <animated.h1 style={opac}>Create a room</animated.h1>
            <div className="create_room">
                <animated.form style={height} className="room-form">
                    <animated.div style={show} className="create-room-head">
                        <div className="room-image-icon">
                            <i class="bi bi-image"></i>
                            <input style={{ display: "none" }} ref={imageRef} type="file" />
                        </div>
                        <div className="room-title-icon">
                            <p className="min">Room title</p>
                            <input type="text" placeholder="Pigeon room" />
                        </div>
                    </animated.div>
                    <animated.div style={show} className="create-room-body">
                        <p className="min">Description</p>
                        <textarea maxLength="150" placeholder="Welcome to pigeon room"></textarea>
                    </animated.div>
                    <animated.div style={show} className="create-room-footer">
                        <p className="min">Members</p>
                        <ul>
                            {members.map(e => {
                                return (
                                    <animated.div className="members-list" >
                                        <img src={`http://localhost:8080/upload/user/${e.contact_id.img}?token=${token}`} alt={`${e.contact_id.username} img`} />
                                        {e.contact_id.username}
                                    </animated.div>
                                )
                            })}
                        </ul>
                    </animated.div>
                </animated.form>
                <div className="contact-list">
                    <animated.div style={width} className="">
                        <animated.h2 style={show}>Contacts</animated.h2>
                        <animated.ul style={show}>
                            {contacts.filter(e => {
                                if (e.contact_id) {
                                    return e;
                                }
                            }).map(e => {
                                return (
                                    <li>
                                        <div style={{background: "transparent"}}>
                                            <img src={`http://localhost:8080/upload/user/${e.contact_id.img}?token=${token}`} alt="" />
                                            <div style={{background: "transparent"}}  className="add-info">
                                                <p>{e.contact_id.username}</p>
                                                <small>Online</small>
                                            </div>
                                        </div>
                                        <i onClick={() => addMember(e)} class="bi bi-plus-square"></i>                                        
                                    </li>
                                )
                            })}
                        </animated.ul>
                    </animated.div>
                <animated.button style={showButton} className="submit-room">
                    <span>GO</span>
                </animated.button>
                </div>
            </div>
        </>
    )
}


export default FocusUI
