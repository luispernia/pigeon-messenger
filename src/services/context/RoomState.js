import { useReducer } from "react";
import axios from "axios";
import roomsContext from "./RoomContext";
import RoomReducer from "./RoomsReducer";
import { handleRoomConnections } from "../sockets/sockets";
axios.defaults.withCredentials = true;

function ProviderRoom({ children }) {
    const initialState = {
        chats: [],
        selectedChat: null,
        messages: [],
        photos: []
    }

    const [state, dispatch] = useReducer(RoomReducer, initialState);

    const refresh_rooms = async () => {
        try {
            let resRooms = await axios.get("http://localhost:8080/user/one", { withCredentials: true });
            let resContacts = await axios.get("http://localhost:8080/contact", { withCredentials: true });
            let chats = [...resRooms.data.user.rooms, ...resContacts.data.contacts];
            let roomConnections = chats.map(e => e.room_id);

            handleRoomConnections(roomConnections);
            
            dispatch({type: "UPDATE_ROOMS", payload: chats});
        } catch (err) {
            alert(err);
        }
    }

    const setSelectedChat = (data) => {
        dispatch({type: "SELECT_CHAT", payload: data});
    }

    const chatPhotos = async ({room_id}) => {
        try {
            let photos = await axios.get(`http://localhost:8080/upload/${room_id}`, {withCredentials: true});
            let formatted = photos.data.files.map(e => {
                return {author: e.author, path: e.path}
            })

            dispatch({type: "UPDATE_PHOTOS", payload: formatted})
            
        } catch(err) {
            alert(err)
        }
    }

    const clearPhotos = async () => {
        dispatch({type: "UPDATE_PHOTOS", payload: []})
    }

    const roomMessages = async ({room_id}) => {
        try {
            let res = await axios.get(`http://localhost:8080/message/${room_id}`, {withCredentials: true}); 
            dispatch({type: "UPDATE_MESSAGES", payload: res.data.message})

        } catch(err) {
            alert(err);
        }
    }

    

    return <roomsContext.Provider value={{ selected: state.selectedChat, chats: state.chats, setSelectedChat , refresh_rooms, chatPhotos, photos: state.photos ,clearPhotos, roomMessages, messages: state.messages}} > {children} </roomsContext.Provider>
}

export default ProviderRoom;


