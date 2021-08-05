import socket from "./socketConfig";

socket.on("createMessage", (arg) => {
    console.log(arg);
})

socket.on("listUsers", (res) => {
    console.log(res);   
})

socket.on("privateMessage", (message) => {
    console.log(message);
})

function handleClientId (user) {
    socket.emit("start", {user}, (res) => {
        console.log(res);
    })
}

function handleChat(user, setRooms, room) {
    socket.emit("joinChat", { name: user.username, room }, ({ roomUsers, myRooms }) => {
        console.log("Room Users", roomUsers);
        setRooms(myRooms);
    })
}

function handleMessage(message, room) {

    socket.emit("sendMessage", { message, room }, (res) => {
        console.log(res);
    });
}

function privateMessage(message, to) {
    socket.emit("privateMessage", { message, to }, (res) => {
        console.log(res);
    });
}

function sendContact(requester, text, to, img) {
    socket.emit("contact-request", { requester, text, to, img }, (res) => {
        console.log(res);
    })
}

export { handleChat, handleMessage, privateMessage, sendContact, handleClientId};