import React, { useState, useContext } from 'react'
import userContext from '../services/context/UserContext';
import {sendContact} from '../services/sockets/sockets';

function Contacts() {

    const {user} = useContext(userContext);
    const [username, setUsername] = useState("");



    return (
        <div className="box"> 
            <h2>Contacts</h2>
            <label> send request </label>
            <input type="text" value={username} onChange={($event) => setUsername($event.target.value)} />
            <button onClick={() => sendContact(username, "Request", user.username)}>Send</button>        
        </div>
    )
}

export default Contacts
