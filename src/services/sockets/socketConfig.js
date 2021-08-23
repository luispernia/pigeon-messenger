import openSocket from "socket.io-client"

const socket = openSocket("https://pigeon-messenger-server.herokuapp.com");

export default socket;