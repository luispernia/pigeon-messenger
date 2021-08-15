import React, { useContext, useEffect, useRef, useState } from 'react'
import roomsContext from '../services/context/RoomContext'
import userContext from "../services/context/UserContext";
import { sendContact } from "../services/sockets/sockets";
import { useSpring, animated } from "react-spring"
import {request_room} from "../services/sockets/sockets";
import axios from 'axios';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css"

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
                        ) : (<RequestContact />)}
                    </div>
                </div>

            ) : ("")}
        </>
    )
}

const CreateRoom = ({ chats }) => {

    const { token, user } = useContext(userContext);
    const {refresh_rooms} = useContext(roomsContext);

    const [members, setMembers] = useState([]);
    const [membersView, setMembersView] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [state, setState] = useState(false);
    const [file, setFile] = useState(null);
    const fileRef = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [cropper, setCropper] = useState(null);
    const [showCropper, setShowCropper] = useState(null);
    const [ended, setEnded] = useState(null);
    const [blob, setBlob] = useState(null);
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");

    const opac = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 200 });
    const height = useSpring({ to: { height: 400 }, from: { height: 0 }, delay: 500 });
    const width = useSpring({ to: { width: 250 }, from: { width: 0 }, delay: 1000 });
    const show = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1200 });
    const showButton = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1200 });

    const addMember = (e) => {
        let index = members.findIndex(x => x.contact_id.username === e.contact_id.username);

        if (index < 0) {
            setMembers([...members, ...[{ ...e, clicked: state }]]);
            if (members.length < 5) {
                setMembersView([...members, ...[{ ...e, clicked: state }]]);
            }

        } else {
            let deleteMember = members.filter(r => r.contact_id.username !== e.contact_id.username);
            setMembers(deleteMember);
            if (members.length < 5) {
                setMembersView(deleteMember)
            }
        }
    }

    const createRoom = async ($event) => {
        $event.preventDefault();

        const formData = new FormData();

        formData.append("photo", blob, "blob.png");
        formData.append("document", JSON.stringify({name: title, members: user, admin: user, description, }));

        let res = await axios.post("http://localhost:8080/room", formData , {
            withCredentials: true, headers: {
            "Content-Type": "multipart/form-data"
        }}).catch(err => alert(err))

        if(members.length > 0) {
            for(let member of members) {
                request_room({img: res.data.room.img, requester: user.username, user_id: member.contact_id._id, room_id: res.data.room.room_id, title: res.data.room.name, description: res.data.room.description, username: member.contact_id.username })
            }
        }
        
        refresh_rooms();
        
    }

    const getData = ($event) => {
        $event.preventDefault();
        let canvas = cropper.getCroppedCanvas({ width: 160, height: 160, imageSmoothingQuality: 'high', });
        canvas.toBlob((blob) => {
            setBlob(blob);
        })
        setEnded(canvas.toDataURL("image/png"));
        setShowCropper(false);
    }

    useEffect(() => {
        setContacts(chats);
    }, [])

    return (
        <>
            {
                showCropper ? (
                    <div className="crop-contain">
                        <Cropper
                            autoCropArea={true}
                            src={photo}
                            viewMode={2}
                            style={{ height: "400px", width: "100%" }}
                            background={false}
                            responsive={true} aspectRatio={1}
                            onInitialized={(instance) => { setCropper(instance) }} />
                        <button className="set-image" onClick={($event) => getData($event)}>Done</button>
                    </div>

                ) : (
                    <>
                        <animated.h1 style={opac}>Create a room</animated.h1>
                        <div className="create_room">
                            <animated.form style={height} className="room-form">
                                <animated.div style={show} className="create-room-head">
                                    <div onClick={() => {
                                        fileRef.current.click();
                                    }} className="room-image-icon" style={{ backgroundImage: `url(${ended})`, backgroundSize: "cover" }}>
                                        <input style={{ display: "none" }} value={file} onChange={($event) => {
                                            if ($event.target.files.length >= 1) {
                                                let src = URL.createObjectURL($event.target.files[0]);
                                                setPhoto(src);
                                                setFile($event.target.file);
                                                setShowCropper(true);
                                            }
                                        }} ref={fileRef} type="file" />

                                    </div>
                                    <div className="room-title-icon">
                                        <p className="min">Room title</p>
                                        <input value={title} onChange={($event) => setTitle($event.target.value)} type="text" placeholder="Pigeon room" />
                                    </div>
                                </animated.div>
                                <animated.div style={show} className="create-room-body">
                                    <p className="min">Description</p>
                                    <textarea value={description} onChange={($event) => setDescription($event.target.value)} maxLength="150" placeholder="Welcome to pigeon room"></textarea>
                                </animated.div>
                                <animated.div style={show} className="create-room-footer">
                                    <p className="min">Members</p>
                                    <ul>
                                        {membersView.map(e => {
                                            return (
                                                <>
                                                    <animated.div className="members-list" >
                                                        <img src={`http://localhost:8080/upload/user/${e.contact_id.img}?token=${token}`} alt={`${e.contact_id.username} img`} />
                                                    </animated.div>
                                                </>
                                            )
                                        })}
                                    </ul>
                                    <p>{members.length > 6 ? `And others ${members.length - 6} members` : ""} </p>
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
                                                    <div style={{ background: "transparent" }}>
                                                        <img src={`http://localhost:8080/upload/user/${e.contact_id.img}?token=${token}`} alt="" />
                                                        <div style={{ background: "transparent" }} className="add-info">
                                                            <p>{e.contact_id.username}</p>
                                                            <small>{e.contact_id.online ? "Online" : "Offline"}</small>
                                                        </div>
                                                    </div>
                                                    <i onClick={() => addMember(e)} class="bi bi-plus-square"></i>
                                                </li>
                                            )
                                        })}
                                    </animated.ul>
                                </animated.div>
                                <animated.button onClick={createRoom} style={showButton} className="submit-room">
                                    <span>GO</span>
                                </animated.button>
                            </div>
                        </div>
                    </>
                )
            }

        </>
    )
}


const RequestContact = () => {

    const imageRef = useRef(null);
    const { token, user } = useContext(userContext);
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [userFounded, setUserFounded] = useState(false);


    const opac = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 200 });
    const opacDeep = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1000 });
    const height = useSpring({ to: { height: 400 }, from: { height: 0 }, delay: 500 });
    const userInput = useSpring({ to: { width: "100%" }, from: { width: "0%" }, delay: 1000 });
    const width = useSpring({ to: { width: "100%", opacity: 1 }, from: { opacity: 0, width: "0%" }, delay: 500 });



    return (
        <>
            <animated.h1 style={opac}>Add Contact</animated.h1>
            <div className="contact-add">
                <animated.div style={height} className="contact-request-search">
                    <animated.div style={width} className="input-search">
                        <i class="bi bi-at"></i>
                        <animated.input
                            value={username}
                            onChange={($event) => setUsername($event.target.value)}
                            style={userInput}
                            type="text"
                            placeholder="Contact username" />
                    </animated.div>
                    <div className="contact-results">
                        <Result username={username} state={setUserFounded} />
                    </div>
                </animated.div>
                <animated.div style={opacDeep} className="request">
                    <animated.input
                        value={message}
                        onChange={($event) => setMessage($event.target.value)}
                        style={userInput}
                        maxLength="80"
                        disabled={!userFounded}
                        type="text"
                        placeholder="Message" />
                    <button onClick={() => sendContact(user.username, message, username, user.img, token)} disabled={!userFounded}>Request</button>
                </animated.div>
            </div>
        </>
    )
}

const Result = ({ username, state }) => {

    const [loaded, setLoaded] = useState(false);
    const [userData, setUserData] = useState({});
    const { token } = useContext(userContext);

    const circleLoad = useSpring({ to: { rotate: 190, borderRadius: 5 }, from: { rotate: 0, borderRadius: 10 }, loop: true })
    const opacDeep = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1000 });

    useEffect(() => {
        setLoaded(false);
        axios.get(`http://localhost:8080/user/search/${username ? username : "xd"}`, { withCredentials: true })
            .then((res) => {
                if (res.data.user) {
                    state(true);
                } else {
                    state(false);
                }

                if (!username) {
                    setLoaded(true);
                    setUserData(null);
                }

                if (res.data.user) {
                    setLoaded(true);
                    setUserData(res.data.user);
                }
            })
            .catch(err => {
                alert(err);
            })

    }, [username])

    return <>
        {loaded ? (
            (userData ? (<div className="userResume">
                <div className="image-resume">
                    <img src={`http://localhost:8080/upload/user/${userData.img}?token=${token}`} alt="" />
                </div>
                <div className="resume-body">
                    <h3>{userData.username}</h3>
                    <p>{userData.online ? "Online" : "Offline"}</p>
                    {userData.description ? (
                        <>
                            <p className="resume-bio">Bio</p>
                            <p className="resume-description">{userData.description}</p>
                        </>
                    ) : ("")}
                </div>
            </div>) : (<animated.p style={opacDeep}>User not defined</animated.p>)
            )
        ) : (
            <animated.div className="loading-circle">
                <animated.div style={circleLoad} className="circle"></animated.div>
                <p>Searching...</p>
            </animated.div>
        )}
    </>
}

export default FocusUI
