import React, { useContext } from 'react'
import userContext from '../services/context/UserContext'
import { useHistory } from 'react-router';
import { useSpring, animated } from 'react-spring';

function Success() {
    const {user} = useContext(userContext);
    const history = useHistory();

    const spring = useSpring({to: {opacity: 1}, from: {opacity: 0}, delay:300});

    function loginPage() {
        history.replace("/login");
    }


    
    return (
        <animated.div style={spring}>
            <h1>Welcome {user}</h1>
            <button onClick={loginPage}>Login into Pigeon Messenger</button>
        </animated.div>
    )
}

export default Success
