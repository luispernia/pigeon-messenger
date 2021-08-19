import React, { useContext, useEffect, useState } from 'react';
import bellsContext from '../services/context/BellContext';
import userContext from "../services/context/UserContext";
import { useSpring, animated } from 'react-spring';
import { acceptContact, rejectContact, declined_room, acceptRoom } from "../services/sockets/sockets";
import roomsContext from '../services/context/RoomContext';
import * as Vibrant from "node-vibrant/dist/vibrant";


function Notifications() {

    const { bells, setBells } = useContext(bellsContext);
    const { setBell, bellState } = useContext(roomsContext);
    const lastElement = bells[bells.length - 1];
    const spring = useSpring({ to: { padding: "3rem", opacity: 1}, from: {padding: "0rem", opacity: 0 }, reverse: !bellState})
    const springDisplay = useSpring({ to: {display: "flex", delay: 100}, from: {display: "none",  delay: 200}, reverse: !bellState })

    return (
        <div className="notifications">
            <div onClick={() => {
                setBell(bellState ? false : true)
                setBells();
                }} className="bell-icon">
                <p className="bells-count">{bells.filter(e => e.watched === false).length > 0? bells.filter(e => e.watched === false).length : ""}</p>
                <i class="bi bi-bell-fill"></i>
            </div>
                <animated.div style={springDisplay}>
                    <animated.div style={spring} className="bells">
                        <div  className="bells-scroll">
                            <div className="bellsContain">
                            {bells.map((e, i) => {
                                return <Bell data={e} />
                            })}
                            </div>
                        </div>

                        <h3>Notifications</h3>
                    </animated.div>
                </animated.div>
        </div>
    )
}

function Bell({ data }) {

    const { request } = data;

    switch (request) {
        case "REQUEST":
            return <BellComponent data={data} request={request} opts={true} />

        case "REQUEST_ACCEPTED":
            return <BellComponent data={data} request={request} opts={false} />

        case "CONTACT_ADDED":
            return <BellComponent data={data} request={request} opts={false} />

        case "REQUEST_DECLINED":
            return <BellComponent data={data} request={request} opts={false} />

        case "REQUEST_ROOM":
            return <BellComponent data={data} request={request} opts={true} />

        case "ROOM_DECLINED":
            return <BellComponent data={data} request={request}/>

        case "ADDED_TO_ROOM":
                return <BellComponent data={data} request={request}/>

        default:
            return "";
    }
}

function BellComponent({ data, request, opts }) {
    const { img, date, requester, title, _id } = data;
    const [color, setColor] = useState("");

    const { token, user, setAlert } = useContext(userContext)
    let hour = new Date(date).getHours();
    let minutes = new Date(date).getMinutes();
    let requesterFormatted = requester.split("/")[0];

    const spring = useSpring({ to: {opacity: 1, transform: "translate(0px, 0px)"}, from: {transform: "translate(-33px, 0px)", opacity: 0 }, delay: 500 });

    useEffect(() => {
        if(img) {
            let v = new Vibrant(`http://localhost:8080/upload/${data.room_id? "room" : "user"}/${img}?token=${token}`, {});
            v.getPalette((err, palette) => {
                if(err) {
                    console.log(err);
                }
                setColor({light: palette.LightVibrant.hex, dark: palette.DarkVibrant.hex, mute: palette.Muted.hex});
            })
        }
    }, [])

    return (
            <animated.div style={spring} className={`bell ${request.toLowerCase()}`}>
                <img src={`http://localhost:8080/upload/${data.room_id? "room" : "user"}/${img}?token=${token}`} alt={`${requesterFormatted} img`} />
                <div className="bell-body">
                    <h4 style={{...spring, color: `${color.light}`}}>{ request !== "ADDED_TO_ROOM"? `${requesterFormatted}` : `${requester.split("/")[1]}`}</h4>
                    <div className="bell-content">
                        <p style={{...spring, color: `${color.light}`}}>{`${title}`}</p>
                        {opts ? (
                            <div className="bell-options">
                                <button style={{...spring, color: color.light, borderColor: color.mute}} onClick={() =>  data.room_id?  (acceptRoom({id: _id, img: user.img}, (res) => {
                                    if(!res.ok) {
                                        setAlert({show: true, text: res.err})
                                    }
                                })) : acceptContact({ id: _id, token, img: user.img }, (res) => {
                                    if(!res.ok) {
                                        setAlert({show: true, text: res.err})
                                    }
                                })} className="accept button">Accept</button>
                                <button style={{...spring, color: color.light, borderColor: color.mute}} onClick={() => data.room_id? (
                                    declined_room({id: _id, img: user.img}, (res) =>{
                                        if(!res.ok) {
                                            setAlert({show: true, text: res.err})
                                        }
                                    })
                                    
                                ) : rejectContact({ id: _id, token, img: user.img }, (res) => {
                                    if(!res.ok) {
                                        setAlert({show: true, text: res.err})
                                    }
                                }) } className="reject button">Reject</button>
                            </div>
                        ) : ""}

                    </div>
                </div>
            </animated.div>
    )
}

export default Notifications
