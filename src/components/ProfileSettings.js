import React, { useContext, } from 'react'
import { useSpring, animated } from 'react-spring';
import roomsContext from '../services/context/RoomContext';
import userContext from '../services/context/UserContext';
import { useHistory } from 'react-router';


const ProfileSettings = () => {

    const { user, token, signOut, setAlert } = useContext(userContext);
    const { refresh_rooms, setFocus, chats } = useContext(roomsContext);

    const history = useHistory();
    const opac = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });
    const close = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1000 })
    const height = useSpring({ to: { height: 200, opacity: 1 }, from: { opacity: 0, height: 100 }, delay: 1000 })
    const width = useSpring({ to: { width: 400, opacity: 1 }, from: { opacity: 0, width: 300 }, delay: 500 })

    const logout = () => {
        signOut(() => {
            setAlert({type: "info", text: "bye"});
            history.replace("/");
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
            <animated.h1 style={opac} className="settings-title">Settings <i className="bi bi-box"></i></animated.h1>
            <animated.div style={{ ...height, ...width }} className="profile_settings">
                <animated.div className="profile-resume">
                    <img src={`http://localhost:8080/upload/user/${user.img}?token=${token}`} alt={`${user.username}`} />
                    <div className="profile-info">
                        <h3><i className="bi bi-at" ></i>{user.username}</h3>
                        <p><i className="bi bi-collection-fill"></i> {chats.filter(e => !e.contact_id).length} Rooms</p>
                        <p><i className="bi bi-person-square"></i> {chats.filter(e => e.contact_id).length} Contacts</p>
                    </div>
                </animated.div>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <animated.button style={close} className="button-logout" onClick={() => logout()}>Logout <i className="bi bi-box-arrow-in-right"></i></animated.button>
                </div>
            </animated.div>
        </>
    )
}

export default ProfileSettings
