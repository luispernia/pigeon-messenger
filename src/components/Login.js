import React, {useState, useContext} from 'react'
import {useHistory, Link} from "react-router-dom";
import userContext from '../services/context/UserContext';

function Login() {

    const { loginEmail } = useContext(userContext);

    const history = useHistory();

    const [loading, setLoading] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleSubmit = async ($event) => {
        $event.preventDefault();
        setLoading("Loading");

        loginEmail({email, password}, () => {
            setLoading("Done!");
            history.replace("/chat");
        })
        
    }


    return (

        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="form">

                <div className="control">
                    <label className="label">Email</label>
                    <input type="email" value={email} onChange={($event => setEmail($event.target.value))} className="input" placeholder="Email" />
                </div>


                <div className="control">
                    <label className="label">Password</label>
                    <input type="password" value={password} onChange={($event => setPassword($event.target.value))} className="input" placeholder="Password" />
                </div>

                <button type="submit" className="submit">Rock</button>
                <p>{loading}</p>
            </form>
        </div>

    )
}

export default Login;