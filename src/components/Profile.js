import React from 'react'
import "./_Profile.scss";

function Profile({ user, logout, token }) {
    return (
        <div className="box profile">
            <h2>Profile</h2>
            <div className="profile-box">
            <img src={`http://localhost:8080/upload/user/${user.img}?token=${token}`} alt="Nothing" />
            <p>@{user.username}</p>
            </div>
        
            <button className="button" onClick={logout}>Logout</button>
        </div>
    )
}

export default Profile
