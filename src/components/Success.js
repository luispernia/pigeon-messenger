import React, { useContext } from 'react'
import userContext from '../services/context/UserContext'
import { useHistory } from 'react-router';

function Success() {
    const {user} = useContext(userContext);
    const history = useHistory();

    function loginPage() {
        history.replace("/login");
    }
    
    return (
        <div>
            <h1>Welcome {user}</h1>
            <button onClick={loginPage}>Login into Pigeon Messenger</button>
        </div>
    )
}

export default Success
