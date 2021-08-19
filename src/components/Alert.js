import React, { useContext, useEffect, useState } from 'react'
import { useSpring, animated } from 'react-spring';
import userContext from '../services/context/UserContext';

function Alert() {

    const { alerts, setAlert } = useContext(userContext);

    return (
        <>
            <div className="pigeon-alert-container">
                {alerts.map(e => {
                    return <AlertComponent data={e} />
                })}
            </div>
        </>
    )
}

const AlertComponent = ({ data }) => {

    const { alerts, setAlert } = useContext(userContext);
    const [show, setShow] = useState(true);
    const [reversing, setReversing] = useState(false);
    const spring = useSpring({ to: { transform: "translate(1rem, 0rem)", opacity: 1 }, from: { transform: "translate(-1rem, 0rem)", opacity: 0 }, reverse: reversing })

    useEffect(() => {
        console.log(data);
        setTimeout(() => {
            setReversing(true);
            setTimeout(() => {
                setShow(false);
            }, 400);
        }, 5000);
    }, [])

    return (
        <>
            {show ? (
                <animated.div style={spring} className={`${alert.type === "info" ? "info" : ""} pigeon-alert`}>
                    {data.resalt ? (
                        <p>{`${data.text.split("/")[0]}`} <span>{`${data.resalt}`}</span>  {`${data.text.split("/")[1]}`}</p>
                    ) : (
                        <p>{data.text}</p>
                    )}
                    {data.type === "info" ? (
                        <i class="bi bi-eyeglasses"></i>
                    ) : (
                        <i class="bi bi-exclamation-circle-fill"></i>
                    )}
                </animated.div>
            ) : (
                ""
            )}
        </>
    )
}

export default Alert
