import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

socket.on("notify", (args, cb) => {
    console.log(args);
})

socket.emit("ide", { dumb: "dummy" }, (res) => {
    console.log(res);
});

socket.on("createMessage", (arg) => {
    console.log(arg);
})

socket.on("listUsers", (res) => {
    console.log(res);
})

socket.on("privateMessage", (message) => {
    console.log(message);
})

function handleChat() {
    socket.emit("joinChat", { name: user.username, room }, ({ roomUsers, myRooms }) => {
        console.log("Room Users", roomUsers);
        setRooms(myRooms);
    })
}

function handleMessage() {

    socket.emit("sendMessage", { message, room }, (res) => {
        console.log(res);
    });
}

function privateMessage() {
    socket.emit("privateMessage", { message, to }, (res) => {
        console.log(res);
    });
}

function sendContact() {
    socket.emit("contact-request", { username: to }, cb => {
        console.log("contact");
        console.log(cb);
    })
}

export {socket, handleChat, handleMessage, privateMessage, sendContact};