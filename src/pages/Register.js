import React, { useContext, useState } from 'react'
import { useHistory, Link } from "react-router-dom";
import userContext from "../services/context/UserContext";
import Child from "../components/Child";

function Register() {
    const { user, signUpEmail } = useContext(userContext);
    const history = useHistory();

    const [loading, setLoading] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");


    const handleSubmit = async ($event) => {
        $event.preventDefault();
        setLoading("loading");
        signUpEmail({ name, email, password, username }, () => {
            setLoading("Done")
            history.replace("/success");
        });
    }

    return (
        <div>
            <h2>Register</h2>
            <p>{loading}</p>
            <form onSubmit={handleSubmit} className="form">

                <div className="control">
                    <label className="label">Username</label>
                    <input type="text" value={username} onChange={($event => setUsername($event.target.value))} className="input" placeholder="Username" />
                </div>

                <div className="control">
                    <label className="label">Name</label>
                    <input type="text " value={name} onChange={($event => setName($event.target.value))} className="input" placeholder="Name" />
                </div>

                <div className="control">
                    <label className="label">Email</label>
                    <input type="email" value={email} onChange={($event => setEmail($event.target.value))} className="input" placeholder="Email" />
                </div>


                <div className="control">
                    <label className="label">Password</label>
                    <input type="password" value={password} onChange={($event => setPassword($event.target.value))} className="input" placeholder="Password" />
                </div>

                <button type="submit" className="submit">Rock</button>
            </form>

            <Child />
        </div>
    )
}

export default Register
