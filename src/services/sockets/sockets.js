import socket from "./socketConfig";
import axios from "axios";

function handleClientId(token) {
    socket.emit("start", { token, rooms: null }, (res) => {
        console.log(res);
    })
}

function handleRoomConnections(rooms, token) {
    socket.emit("start", { token, rooms, type: null }, (res) => {
        console.log(res);
    })
}

function sendContact(requester, text, to, img, token) {
    axios.post("http://localhost:8080/contact/on", { to }, { withCredentials: true })
        .then(res => {
            console.log(res.data.contact);
            if (!res.data.contact.length > 0) {
                socket.emit("contact-request", { requester: `${requester}/${to}`, text, to, img, token }, (res) => {
                    if (!res.ok) {
                        alert(res.err);
                    }
                })
            } else {
                alert("You already have this contact");
            }
        }).catch(err => console.log(err))
}

function acceptContact(data) {
    socket.emit("contact-accepted", data, (res) => {
        if (!res.ok) {
            console.log(res);
            alert(res);
        }
    })
}

function rejectContact(data) {
    socket.emit("reject-contact", data, (res) => {
        if (!res.ok) {
            alert(res.err);
        }
    })
}

const sendMessage = (data) => {
    
    socket.emit("sendMessage", data, (res) => {
        if(!res.ok) {
            alert(res.err)
        }

        console.log(res);
    })
}   

const request_room = (data) => {
    socket.emit("room_request", data, (res) => {
        if(!res.ok) {
            alert(res.err);
        }
    })
}

const declined_room = ({id, img}) => {
    socket.emit("room_declined", {id, img}, (res) => {
        if(!res.ok) {
            alert(res.err);
        }
    })
}

const acceptRoom = (data) => {
    socket.emit("room_accepted", data, (res) => {
        if(!res.ok) {
            alert(res.err);
        }
    })
}

export {
    sendContact,
    handleClientId,
    acceptContact,
    rejectContact,
    sendMessage,
    handleRoomConnections,
    request_room,
    declined_room,
    acceptRoom
};