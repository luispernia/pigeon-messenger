import React from 'react'
import "./_Register.scss";
import {useHistory} from "react-router-dom";

function Register() {

    const history = useHistory();


    const handleSubmit = ($event) => {
        $event.preventDefault();
    }


    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="control">
                    <label className="label">Username</label>
                    <input type="text" className="input" placeholder="Username" />
                </div>
                <div className="control">
                    <label className="label">Email</label>
                    <input type="email" className="input" placeholder="Email" />
                </div>
                <div className="control">
                    <label className="label">Password</label>
                    <input type="password" className="input" placeholder="Password" />
                </div>
                <button type="submit" className="submit">Rock</button>
            </form>
        </div>
    )
}

export default Register
