import React, { useContext, useEffect, useState } from 'react'
import { useSpring, animated } from 'react-spring';
import userContext from '../services/context/UserContext';

function Alert() {

    const {alert, setAlert} = useContext(userContext);  
    const [reversing, setReversing] = useState(false);
    const spring = useSpring({to: {transform: "translate(1rem, 0rem)", opacity: 1}, from: {transform: "translate(-1rem, 0rem)", opacity: 0}, reverse: reversing})

    useEffect(() => {
        setTimeout(() => {
            setReversing(true);
            setTimeout(() => {
                setAlert({show: false, resalt: null});
            }, 1000);   
        }, 10000);
    }, [])

    return (
        <animated.div style={spring} className={`${alert.type === "info"? "info" : ""} pigeon-alert`}>
            {alert.resalt? (
                <p>{`${alert.text.split("/")[0]}`} <span>{`${alert.resalt}`}</span>  {`${alert.text.split("/")[1]}`}</p>
            ) : (
                <p>{alert.text}</p>
            )}
            {alert.type === "info"? (
                <i class="bi bi-eyeglasses"></i>
            ) : (
                <i class="bi bi-exclamation-circle-fill"></i>
            )}
        </animated.div>
    )
}

export default Alert
