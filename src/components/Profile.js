import React, { useContext } from 'react'
import userContext from '../services/context/UserContext'
import { useHistory } from "react-router-dom";
import Notifications from './Notifications';

function Profile() {

    const history = useHistory();
    const {user, token, signOut} = useContext(userContext);

    
    const logout = async (user) => {
        signOut(() => {
            alert("Bye");
            history.replace("/");
        })
    }

    return (
        <div className="profile">
            <div className="profile-opts">
                <img src={`http://localhost:8080/upload/user/${user.img}?token=${token}`} alt="" />
                <div>
                    <h3><span><i class="bi bi-at"></i></span>{user.username}</h3>
                    <p><span><i class="bi bi-box"></i></span> Settings</p>
                </div>
            </div>

            <div className="notifications-panel">
                <Notifications />
            </div>
        </div>
    )
}

export default Profile
