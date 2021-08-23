/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { useSpring, animated } from 'react-spring';
import userContext from '../services/context/UserContext';

function Alert() {

    const { alerts, toDelete } = useContext(userContext);
    const [alert, setAlert] = useState([]);

    useEffect(() => {
        alert.pop();
    }, [toDelete])

    useEffect(() => {
        setAlert(alerts? alerts : []);
    }, [alerts])

    return (
        <>
            <div className="pigeon-alert-container">
                {alert.map((e, i) => {
                    return <AlertComponent key={i} alertID={i} data={e} />
                })}
            </div>
        </>
    )
}

const AlertComponent = ({data, alertID}) => {

    const {deleteAlert} = useContext(userContext);
    const [show, setShow] = useState(true);
    const [reversing, setReversing] = useState(false);
    const spring = useSpring({ to: { transform: "translate(1rem, 0rem)", opacity: 1 }, from: { transform: "translate(-1rem, 0rem)", opacity: 0 }, reverse: reversing })

    useEffect(() => {
        setTimeout(() => {
            setReversing(true);
            setTimeout(() => {
                deleteAlert([alertID], () => {
                    
                });
                setShow(false);   
            }, 400);
        }, 3000);
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
                        <i className="bi bi-eyeglasses"></i>
                    ) : (
                        <i className="bi bi-exclamation-circle-fill"></i>
                    )}
                </animated.div>
            ) : (
                ""
            )}
        </>
    )
}

export default Alert
