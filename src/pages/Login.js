import React, {useState, useContext} from 'react'
import {useHistory} from "react-router-dom";
import GoogleSignIn from '../components/GoogleSignIn';
import userContext from '../services/context/UserContext';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

function Login() {

    const { loginEmail, alerts } = useContext(userContext);

    const history = useHistory();

    const [loading, setLoading] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleSubmit = async ($event) => {
        $event.preventDefault();
        
        setLoading("Loading");

        loginEmail({email, password}, (res) => {
            if(!res.ok) {
                setLoading("failed");
                return;
            }
            history.replace("/chat");
        })
        
    }


    return (

        <div>
            {alerts.length > 0 ? (
                <Alert />
            ) : ("")}
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="form">

                <GoogleSignIn type="login" history={history} loading={setLoading} />

                <div className="control">
                    <label className="label">Email</label>
                    <input type="email" value={email} onChange={($event => setEmail($event.target.value))} className="input" placeholder="Email" />
                </div>


                <div className="control">
                    <label className="label">Password</label>
                    <input type="password" value={password} onChange={($event => setPassword($event.target.value))} className="input" placeholder="Password" />
                </div>

                <button type="submit" className="submit">Rock</button>
                <p>{loading === "Loading"? (
                    <Loading/>
                ) : ("")}</p>
            </form>
        </div>

    )
}

export default Login;