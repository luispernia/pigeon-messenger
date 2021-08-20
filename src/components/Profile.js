import React, { useContext } from 'react'
import userContext from '../services/context/UserContext'
import { useHistory } from "react-router-dom";
import Notifications from './Notifications';
import roomsContext from '../services/context/RoomContext';

function Profile() {

    const history = useHistory();
    const {user, token, signOut} = useContext(userContext);
    const {setFocus} = useContext(roomsContext);

    return (
        <div className="profile">
            <div className="profile-opts">
                <img src={`http://localhost:8080/upload/user/${user.img}?token=${token}`} alt="" />
                <div>
                    <h3><span><i className="bi bi-at"></i></span>{user.username}</h3>
                    <p onClick={() => setFocus(true, "settings")} ><span><i className="bi bi-box"></i></span> Settings</p>
                </div>
            </div>

            <div className="notifications-panel">
                <Notifications />
            </div>
        </div>
    )
}

export default Profile
