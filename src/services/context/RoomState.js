import { useContext, useReducer } from "react";
import axios from "axios";
import roomsContext from "./RoomContext";
import RoomReducer from "./RoomsReducer";
import { handleRoomConnections } from "../sockets/sockets";
import userContext from "./UserContext";
axios.defaults.withCredentials = true;

function ProviderRoom({ children }) {
    const initialState = {
        chats: [],
        selectedChat: null,
        messages: [],
        photos: [],
        focus: { bool: false, type: "" },
        chatPeeks: {}
    }

    const [state, dispatch] = useReducer(RoomReducer, initialState);
    
    const {token} = useContext(userContext);

    const roomMessages = async ({ room_id }) => {
        try {
            let res = await axios.get(`http://localhost:8080/message/${room_id}`, { withCredentials: true });
            dispatch({ type: "UPDATE_MESSAGES", payload: res.data.message })

        } catch (err) {
            alert(err);
        }
    }


    const refresh_rooms = async () => {
        try {
            let resRooms = await axios.get("http://localhost:8080/user/one", { withCredentials: true });
            let resContacts = await axios.get("http://localhost:8080/contact", { withCredentials: true });
            let chats = [...resRooms.data.user.rooms, ...resContacts.data.contacts];
            let roomConnections = chats.map(e => e.room_id);
            handleRoomConnections(roomConnections, token);
            for (let chat of chats) {
                if (chat.contact_id) {
                    dispatch({ type: "CHAT_PEEKS", payload: { prop: chat.room_id, content: { messages: [], online: false, bells: 0 } } })
                } else {
                    dispatch({ type: "CHAT_PEEKS", payload: { prop: chat.room_id, content: { messages: [], online: false, bells: 0 } } })
                }
            }


            dispatch({ type: "UPDATE_ROOMS", payload: chats });

        } catch (err) {
            alert(err);
        }
    }

    const setSelectedChat = (data) => {
        dispatch({ type: "SELECT_CHAT", payload: data });
    }

    const chatPhotos = async ({ room_id }) => {
        try {
            let photos = await axios.get(`http://localhost:8080/upload/${room_id}`, { withCredentials: true });
            let formatted = photos.data.files.map(e => {
                return { author: e.author, path: e.path }
            })

            dispatch({ type: "UPDATE_PHOTOS", payload: formatted })

        } catch (err) {
            alert(err)
        }
    }

    const clearPhotos = async () => {
        dispatch({ type: "UPDATE_PHOTOS", payload: [] })
    }

    const setFocus = (bool, type) => {
        dispatch({ type: "FOCUS", payload: { bool, type } });
    }

    const updatePeek = (room_id, prop, value) => {
        dispatch({ type: "UPDATE_PEEK", payload: { room_id, prop, value } })
    }

    const unreaded = async (room_id) => {
        try {
            let res = await axios.post("http://localhost:8080/message/unread", { room_id }, { withCredentials: true });
            updatePeek(room_id, "bells", res.data.count);
        } catch (err) {
            alert(err)
        }
    }

    const setReaded = async (room_id) => {
        try {
            let res = await axios.put("http://localhost:8080/message/readed", {room_id}, {withCredentials: true});
            console.log(res);
            dispatch({type: "UPDATE_PEEK", payload: {room_id, prop: "bells", value: 0}})
        } catch(err) {
            alert(err)
        }
    }



    return <roomsContext.Provider value={{
        selected: state.selectedChat,
        chats: state.chats,
        setSelectedChat,
        refresh_rooms,
        chatPhotos,
        photos: state.photos,
        clearPhotos,
        roomMessages,
        messages: state.messages,
        setFocus,
        focus: state.focus,
        chatPeeks: state.chatPeeks,
        updatePeek,
        unreaded,
        setReaded
    }} > {children} </roomsContext.Provider>
}

export default ProviderRoom;


