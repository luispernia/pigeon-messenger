import React, { useContext, useEffect, useRef } from 'react'
import { handleClientId } from "../services/sockets/sockets";

import userContext from '../services/context/UserContext';
import bellsContext from '../services/context/BellContext';
import roomsContext from "../services/context/RoomContext";

import socket from "../services/sockets/socketConfig";
import ChatView from "../components/ChatView";
import Profile from "../components/Profile";
import Rooms from "../components/Rooms";
import ChatHeader from '../components/ChatHeader';
import FocusUI from '../components/FocusUI';
import Alert from '../components/Alert';
import messagesContext from '../services/context/MessagesContext';
import { useSpring, animated } from 'react-spring';
import useWindowSize from '../components/useWindowSize';


function Chat() {

    const { token, alerts, setAlert, refresh_token } = useContext(userContext);
    const { addBell, refresh_bell, } = useContext(bellsContext);
    const { refresh_rooms, updatePeek, showBar, setShowBar } = useContext(roomsContext);
    const {setMessageUpload} = useContext(messagesContext);
    const [width, height] = useWindowSize();

    useEffect(() => {
        socket.on("onMessage", (args) => {

            let content = args.message;
            if(!content.files) {
                content.files = [];
                setMessageUpload({message: content, room_id: content.room_id});
                return;
            }
            setMessageUpload({message: content, room_id: content.room_id});
        })

    }, [])


    useEffect(() => {
        refresh_rooms();
        refresh_bell();
        handleClientId(token);
        refresh_token();

        socket.on("notify", (args) => {
            addBell(args, ({ ring }) => {
                let thing = args.bell.title ? setAlert({ type: "info", show: true, text: args.bell.title }) : ("");
                if (ring) {
                    let bell = new Audio("bell.wav");
                    bell.play();
                }
            });
        })

        socket.on("userConnect", (res) => {
            updatePeek(res.room_id, "online", true);
        })

        socket.on("userDisconnect", (res) => {
            updatePeek(res.room_id, "online", false);
        })
    }, [])



    return (
        <>
            {alerts.length > 0 ? (
                <Alert />
            ) : ("")}
            <div className="container">
                <FocusUI />

                {showBar.show? (
                    ""
                    ) : (
                        <PrimaryColumn /> 
                )}


                <div className="principal-view">
                    <div className="principal-bar">
                        {width <= 768? (
                            ""
                        ) : (<Profile />)} 
                        <ChatHeader />
                    </div>
                    <ChatView />

                </div>
            </div>
        </>
    )
}

const PrimaryColumn = () => {


    const { showBar, setShowBar } = useContext(roomsContext);
    const [width, height] = useWindowSize();
    const spring = useSpring({to: {width: "0%"}, from: {width: "100%"}, reverse: !showBar.reverse, delay: 500});
    const springOpac = useSpring({to: {opacity: 0}, from: {opacity: 1}, reverse: !showBar.reverse, delay: 400 });


    return (
    <>
        {width? (
            <>
            <animated.div style={{...spring}} className="primary-column">
                <Rooms />
            </animated.div>
            </>
        ) : (
            ""
        )}
    </>
    )
}

export default Chat