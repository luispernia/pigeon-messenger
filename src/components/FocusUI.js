/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from 'react'
import roomsContext from '../services/context/RoomContext'
import userContext from "../services/context/UserContext";
import { sendContact } from "../services/sockets/sockets";
import { useSpring, animated } from "react-spring"
import { request_room } from "../services/sockets/sockets";
import axios from 'axios';
import Cropper from "react-cropper";
import { useFormik } from "formik";
import ProfileSettings from "./ProfileSettings";
import {api} from "../services/config";
import "cropperjs/dist/cropper.css"

const validate = (values) => {
    const errors = {};
    if (!values.title) {
        errors.title = 'Required';
    } else if (values.title.length > 20) {
        errors.title = 'Must be 20 characters or less';
    }

    if (values.description.length > 150) {
        errors.description = 'Must be 150 characters or less';
    }


    return errors;
}

function FocusUI() {

    const props = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } })

    let { focus, chats} = useContext(roomsContext);

    return (
        <>
            {focus.bool ? (
                <animated.div style={props} className="focus">
                    <div className="glass">
                        {focus.type === "room" ?
                            (
                                <CreateRoom chats={chats} />
                            ) : focus.type === "settings" ?
                                (<ProfileSettings />) :
                                focus.type === "add-member" ?
                                    (<AddMember chats={chats} />) :
                                    (<RequestContact />)
                        }
                    </div>
                </animated.div>

            ) : ("")}
        </>
    )
}

const CreateRoom = ({ chats }) => {

    const { token, user, setAlert } = useContext(userContext);
    const { refresh_rooms, setFocus, contacts, setContacts } = useContext(roomsContext);

    const spring_error = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
        },
        validate,
        onSubmit: values => {
            setFocus(false);
            createRoom((res) => {
                if (members.length > 0) {
                    setAlert({ type: "info", text: `Request to join / room sended`, resalt: `${values.title}`, show: true })
                }
            });

        }
    })

    const [members, setMembers] = useState([]);
    const [membersView, setMembersView] = useState([]);
    const [ended, setEnded] = useState("");
    const fileRef = useRef("");
    const [description, setDescription] = useState("");
    const [photo, setPhoto] = useState("");
    const [title, setTitle] = useState("");
    const [file, setFile] = useState("");
    const [cropper, setCropper] = useState("");
    const [showCropper, setShowCropper] = useState("");
    const [blob, setBlob] = useState("");

    const opac = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 200 });
    const height = useSpring({ to: { height: 400 }, from: { height: 0 }, delay: 500 });
    const width = useSpring({ to: { width: 250 }, from: { width: 0 }, delay: 1000 });
    const show = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1200 });
    const showButton = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1200 });

    const addMember = (e, i) => {
        let index = members.findIndex(x => x.contact_id.username === e.contact_id.username);
        let contactFiltered = contacts.filter(e => e.contact_id? e : null)

        contactFiltered[i].toggle = contactFiltered[i].toggle ? false : true;


        if (index < 0) {
            setContacts(contactFiltered);
            setMembers([...members, ...[{ ...e }]]);
            if (members.length < 5) {
                setMembersView([...members, ...[{ ...e }]]);
            }

        } else {
            let deleteMember = members.filter(r => r.contact_id.username !== e.contact_id.username);
            setContacts(contactFiltered);
            setMembers(deleteMember);
            if (members.length < 5) {
                setMembersView(deleteMember)
            }
        }
    }

    const createRoom = async (cb) => {

        const formData = new FormData();
        if (blob) {
            formData.append("photo", blob, "blob.png");

        }

        formData.append("document", JSON.stringify({ name: title, members: user, admin: user, description, }));

        let res = await axios.post(`${api}/room`, formData, {
            withCredentials: true, headers: {
                "Content-Type": "multipart/form-data"
            }
        }).catch(err => alert(err))

        if (members.length > 0) {
            for (let member of members) {
                request_room({ img: res.data.room.img, requester: user.username, user_id: member.contact_id._id, room_id: res.data.room.room_id, title: res.data.room.name, description: res.data.room.description, username: member.contact_id.username })
            }
        }

        refresh_rooms(() => {
            cb({ room_id: res.data.room.room_id });
        });


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

    const close = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1000 })


    useEffect(() => {
        setContacts(chats);
        return () => {
            setContacts([]);
        }
    }, [])

    return (
        <>
            <animated.div style={close} onClick={() => {
                setFocus(false)
                refresh_rooms();
            }} className="close">
                <animated.i style={close} className="bi bi-x-circle"></animated.i>
            </animated.div>
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
                        <form onSubmit={formik.handleSubmit} className="create_room">
                            <animated.div style={height} className="room-form">
                                <animated.div style={show} className="create-room-head">
                                    <div onClick={() => {
                                        fileRef.current.click();
                                    }} className="room-image-icon" style={{ backgroundImage: ` url(${ended ? ended : `${api}/upload/room/default.png?token=${token}`})`, backgroundSize: "cover" }}>
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
                                        <input name="title" id="title" value={formik.values.title} onChange={($event) => {
                                            setTitle($event.target.value)
                                            formik.handleChange($event);
                                        }} type="text" placeholder="Pigeon room" />
                                        {formik.errors.title ? (<animated.div style={spring_error} className="field_error">{formik.errors.title}</animated.div>) : ("")}
                                    </div>
                                </animated.div>
                                <animated.div style={show} className="create-room-body">
                                    <p className="min">Description</p>
                                    <textarea name="description" id="description" value={formik.values.description} onChange={($event) => {
                                        setDescription($event.target.value)
                                        formik.handleChange($event)
                                    }} maxLength="150" placeholder="Welcome to pigeon room"></textarea>
                                    {formik.errors.description ? (<animated.div style={spring_error} className="field_error">{formik.errors.description}</animated.div>) : ("")}

                                </animated.div>
                                <animated.div style={show} className="create-room-footer">
                                    <p className="min">Members</p>
                                    <ul>
                                        {membersView.map((e,i) => {
                                            return (
                                                    <animated.div key={i} className="members-list" >
                                                        <img src={`${api}/upload/user/${e.contact_id.img}?token=${token}`} alt={`${e.contact_id.username} img`} />
                                                    </animated.div>
                                            )
                                        })}
                                    </ul>
                                    <p>{members.length > 6 ? `And others ${members.length - 6} members` : ""} </p>
                                </animated.div>
                            </animated.div>
                            <div className="contact-list">
                                <animated.div style={width} className="">
                                    <animated.h2 style={show}>Contacts</animated.h2>
                                    <animated.ul style={show}>
                                        {contacts.filter(e => e.contact_id? e : null)
                                        .map((e, i) => {
                                            return (
                                                <li key={i} style={e.toggle ? { background: "var(--dark-primary)" } : { background: "transparent" }}>
                                                    <div style={{ background: "transparent" }}>
                                                        <img src={`${api}/upload/user/${e.contact_id.img}?token=${token}`} alt="" />
                                                        <div style={{ background: "transparent" }} className="add-info">
                                                            <p>{e.contact_id.username}</p>
                                                            <small>{e.contact_id.online ? "Online" : "Offline"}</small>
                                                        </div>
                                                    </div>
                                                    <i onClick={() => addMember(e, i)} className={`bi bi-${e.toggle ? "dash" : "plus"}-square`}></i>
                                                </li>
                                            )
                                        })}
                                        {contacts.filter(e => e.contact_id? e : null).length <= 0? (
                                            <p>Add some contacts in <i className="bi bi-person-plus"></i></p>
                                        ) : (
                                            ""
                                        )}
                                    </animated.ul>
                                </animated.div>
                                <animated.button type="submit" style={showButton} className="submit-room" disabled={formik.errors.title ? true : false}>
                                    <span>GO</span>
                                </animated.button>
                            </div>
                        </form>
                    </>
                )
            }

        </>
    )
}


const RequestContact = () => {

    const { setFocus, refresh_rooms } = useContext(roomsContext);
    const { token, user, setAlert } = useContext(userContext);
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [userFounded, setUserFounded] = useState(false);


    const opac = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 200 });
    const opacDeep = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1000 });
    const height = useSpring({ to: { height: 400 }, from: { height: 0 }, delay: 500 });
    const userInput = useSpring({ to: { width: "100%" }, from: { width: "0%" }, delay: 1000 });
    const width = useSpring({ to: { width: "100%", opacity: 1 }, from: { opacity: 0, width: "0%" }, delay: 500 });
    const close = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1000 })


    const handleRequest = () => {
        sendContact(user.username, message, username, user.img, token, (res) => {
            if (!res.ok) {
                setAlert({ show: true, text: "error" });
                console.log(res.err);
                return;
            } else {
                setAlert({ show: true, text: `request sended to/`, resalt: username, type: "info" });
                setFocus(false)
            }
        })
    }

    return (
        <>
            <animated.div style={close} onClick={() => {
                setFocus(false)
                refresh_rooms();
            }} className="close">
                <animated.i style={close} className="bi bi-x-circle"></animated.i>
            </animated.div>
            <animated.h1 style={opac}>Add Contact</animated.h1>
            <div className="contact-add">
                <animated.div style={height} className="contact-request-search">
                    <animated.div style={width} className="input-search">
                        <i className="bi bi-at"></i>
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
                    <button onClick={() => handleRequest()} disabled={!userFounded}>Request</button>
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
        axios.get(`${api}/user/search/${username ? username : "xd"}`, { withCredentials: true })
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
            (userData ? 
            (<div className="userResume">
                <div className="image-resume">
                    {userData.img? (
                        <img src={`${api}/upload/user/${userData.img}?token=${token}`} alt="" />
                    ) : ("")}
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

const AddMember = ({ chats }) => {

    const { contacts, setContacts, selected, setFocus, refresh_rooms } = useContext(roomsContext);
    const [members, setMembers] = useState([]);
    const { token, setAlert, user } = useContext(userContext);

    const opac = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 200 });
    const height = useSpring({ to: { height: 300, opacity: 1 }, from: { height: 0, opacity: 0 }, delay: 500 });
    const width = useSpring({ to: { width: 250 }, from: { width: 0 }, delay: 1000 });
    const show = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1200 });
    const showButton = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1200 });
    const close = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1000 })


    const addMember = (e, i) => {
        let index = members.findIndex(x => x.contact_id.username === e.contact_id.username);
        let contactFiltered = contacts.filter(e => e.contact_id? e : null);

        let respo = selected.members.map(e => {
            return e.username;
        }).indexOf(contactFiltered[i].contact_id.username);

        if (respo > -1) {
            setAlert({ type: "info", text: `Member / already in room`, resalt: `${contactFiltered[i].contact_id.username}`, show: true })
            return;
        }

        contactFiltered[i].toggle = contactFiltered[i].toggle ? false : true;

        if (index < 0) {
            setContacts(contactFiltered);
            setMembers([...members, ...[{ ...e }]]);

        } else {
            let deleteMember = members.filter(r => r.contact_id.username !== e.contact_id.username);
            setContacts(contactFiltered);
            setMembers(deleteMember);
        }
    }

    const joinMembers = async () => {
        if (members.length > 0) {
            for (let member of members) {
                request_room({ img: selected.img, requester: user.username, user_id: member.contact_id._id, room_id: selected.room_id, title: selected.name, description: selected.description, username: member.contact_id.username })
            }
            setFocus(false);
            setAlert({ type: "info", text: "Request to join / sended", resalt: selected.name })
        } else {
            setAlert({ text: "Add some members first!", show: true })
        }
    }

    useEffect(() => {
        setContacts(chats);
        return () => {
            setContacts([]);
        }
    }, [])

    return (
        <>
        <animated.div style={close} onClick={() => {
                setFocus(false)
                refresh_rooms();
            }} className="close">
                <animated.i style={close} className="bi bi-x-circle"></animated.i>
            </animated.div>
            <div style={opac} className="add-member-title">
                <animated.h1 style={opac}>Add Members</animated.h1>
                <animated.h3 style={opac}>{selected.name}</animated.h3>
            </div>
            <div className="add-member-ui">
                <animated.div style={height} className="current-contacts">
                    <animated.p style={show} >{selected.members.length} members</animated.p>
                    <div className="current-scroll">
                        {selected.members.map((e, i) => {
                            return (
                                <animated.div key={i} style={show} className="current-user">
                                    <img src={`${api}/upload/user/${e.img}?token=${token}`} alt={`${e.username} img`} />
                                    <animated.div>
                                        <h4>{e.username}</h4>
                                        <p>{e._id === selected.admin ? `creator` : `member`}</p>
                                    </animated.div>
                                </animated.div>
                            )
                        })}
                    </div>
                </animated.div>
                <div className="contact-list">
                    <animated.div style={width} className="">
                        <animated.h2 style={show}>Contacts</animated.h2>
                        <animated.ul style={show}>
                            {contacts.filter(e => e.contact_id? e : null).map((e, i) => {
                                return (
                                    <li key={i} style={e.toggle ? { background: "var(--dark-primary)" } : { background: "transparent" }}>
                                        <div style={{ background: "transparent" }}>
                                            <img src={`${api}/upload/user/${e.contact_id.img}?token=${token}`} alt="" />
                                            <div style={{ background: "transparent" }} className="add-info">
                                                <p>{e.contact_id.username}</p>
                                                <small>{e.contact_id.online ? "Online" : "Offline"}</small>
                                            </div>
                                        </div>
                                        <i onClick={() => addMember(e, i)} className={`bi bi-${e.toggle ? "dash" : "plus"}-square`}></i>
                                    </li>
                                )
                            })}
                        </animated.ul>
                    </animated.div>
                    <animated.button onClick={joinMembers} type="submit" style={showButton} className="submit-room add">
                        <span>Add</span>
                        <i className="bi bi-outlet"></i>
                    </animated.button>
                </div>
            </div>
        </>
    )
}

export default FocusUI
