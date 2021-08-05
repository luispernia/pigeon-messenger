import React from 'react'
import "./_Profile.scss";

function Profile({ user, logout, token }) {
    return (
        <div className="box profile">
            <h2>Profile</h2>
            <img src={`http://localhost:8080/upload/user/${user.img}?token=${token}`} width="100px" alt="Nothing" />
            <div className="control">
                <h4> <span>Name:</span> {user.name}</h4>
            </div>
            <div className="control">
                <h4><span>Email:</span> {user.email}</h4>
            </div>
            <div className="control">
                <h4><span>Username:</span> {user.username}</h4>
            </div>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default Profile
