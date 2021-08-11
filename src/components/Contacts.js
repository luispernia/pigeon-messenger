import React, { useState, useContext } from 'react'
import userContext from '../services/context/UserContext';
import { sendContact } from '../services/sockets/sockets';

function Contacts() {

    const { user, token } = useContext(userContext);
    const [username, setUsername] = useState("");
    const [reqMessage, setReqMessage] = useState("");


    return (
        <div className="box contacts">
            <h2>Contacts</h2>
            <div className="control">
                <label> Send Request </label>
                <div className="control-plug"> 
                    <p>@</p>
                    <input className="input" type="text" value={username} onChange={($event) => setUsername($event.target.value)} placeholder="username" />
                </div>
            </div>
            <div className="control">
                <label> Request Message </label>
                <input className="input" type="text" value={reqMessage} onChange={($event) => setReqMessage($event.target.value)} placeholder="Hey it's me!" />
            </div>
            <button className="button" onClick={() => sendContact(user.username, reqMessage, username, user.img, token )}>Send</button>
        </div>
    )
}

export default Contacts
