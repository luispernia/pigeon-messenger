import { useReducer } from "react";
import axios from "axios";
import roomsContext from "./RoomContext";
import RoomReducer from "./RoomsReducer";
axios.defaults.withCredentials = true;

function ProviderRoom ({children}) {
    const initialState = {
        rooms: [],
        selectedRoom: null
    }

    const [state, dispatch] = useReducer(RoomReducer, initialState);

    const refresh_rooms = async () => {
        try {
            let resRooms = await axios.get("http://localhost:8080/user/one", {withCredentials: true});
            let resContacts = await axios.get("http://localhost:8080/contact", {withCredentials: true});
            

            // dispatch({type: "UPDATE_ROOMS", payload: res.data.user.rooms});
        } catch(err) {
            alert(err);
        }
    }


    return <roomsContext.Provider value={{rooms: state.rooms ,refresh_rooms}} > {children} </roomsContext.Provider>
}

export default ProviderRoom;


