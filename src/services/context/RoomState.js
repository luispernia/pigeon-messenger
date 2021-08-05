import { useReducer } from "react";
import axios from "axios";
import roomsContext from "./RoomContext";
import RoomReducer from "./UserReducer";
axios.defaults.withCredentials = true;

function ProviderRoom ({children}) {
    const initialState = {
        rooms: [],
        selectedRoom: null
    }
}


