import openSocket from "socket.io-client"
import {api} from "../config";

const socket = openSocket(api);

export default socket;