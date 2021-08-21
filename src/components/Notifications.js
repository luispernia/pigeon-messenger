/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import bellsContext from '../services/context/BellContext';
import userContext from "../services/context/UserContext";
import { useSpring, animated } from 'react-spring';
import { acceptContact, rejectContact, declined_room, acceptRoom, roomSettings } from "../services/sockets/sockets";
import roomsContext from '../services/context/RoomContext';

import * as Vibrant from "node-vibrant/dist/vibrant";
import useWindowSize from './useWindowSize';


function Notifications() {

    const { bells, setBells } = useContext(bellsContext);
    const { setBell, bellState } = useContext(roomsContext);
    const [width] = useWindowSize(); 
    
    const spring = useSpring({ to: { padding: "3rem", opacity: 1}, from: {padding: "0rem", opacity: 0 }, reverse: !bellState})
    const springDisplay = useSpring({ to: {display: "flex", delay: 100}, from: {display: "none",  delay: 200}, reverse: !bellState })
    const springMobile = useSpring({ to: { padding: "3rem 1rem", opacity: 1}, from: {padding: "0rem 0rem", opacity: 0 }, reverse: !bellState})
        

    return (
        <div className="notifications">
            <div onClick={() => {
                setBell(bellState ? false : true)
                setBells();
                }} className="bell-icon">
                <p className="bells-count">{bells.filter(e => e.watched === false).length > 0? bells.filter(e => e.watched === false).length : ""}</p>
                <i className="bi bi-bell-fill"></i>
            </div>
                <animated.div style={springDisplay}>
                    <animated.div style={ width <= 430? {...springMobile} : {...spring}} className="bells">
                        <div  className="bells-scroll">
                            <div className="bellsContain">
                                {bells.length > 0? (
                                    bells.map((e, i) => {
                                        return <Bell key={i} data={e} />
                                    })
                                ) : (
                                    <p className="bells-clean">All Clean 😎</p>
                                )}  
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
    const { img, requester, title, _id } = data;
    const [color, setColor] = useState("");

    const { token, user, setAlert } = useContext(userContext)
   
    let requesterFormatted = requester.split("/")[0];

    const spring = useSpring({ to: {opacity: 1, transform: "translate(0px, 0px)"}, from: {transform: "translate(-33px, 0px)", opacity: 0 }, delay: 500 });

    const joinRoom = () => {
        acceptRoom({id: _id, img: user.img}, (res) => {
            if(!res.ok) {
                setAlert({show: true, text: res.err})
                return;
            }
        })
        console.log(data);
        roomSettings({type: "add_member", value: `${user.username} joins`, room_id: data.room_id? data.room_id : "", author: user }, (res) => {
            console.log(res);
        })

    }

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
                                <button style={{...spring, color: color.light, borderColor: color.mute}} onClick={() =>  data.room_id?  (
                                    joinRoom()
                                    )
                                 : acceptContact({ id: _id, token, img: user.img }, (res) => {
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
