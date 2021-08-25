import { useContext, useReducer } from "react";
import axios from "axios";
import roomsContext from "./RoomContext";
import RoomReducer from "./RoomsReducer";
import { handleRoomConnections } from "../sockets/sockets";
import userContext from "./UserContext";
import {api} from "../config";
import {useCookies} from "react-cookie";
axios.defaults.withCredentials = true;

function ProviderRoom({ children }) {
    const initialState = {
        chats: [],
        selectedChat: null,
        photos: [],
        focus: { bool: false, type: "", bell: false, resetPeek: false },
        chatPeeks: {},
        contacts: [],
        size: 0,
        showBar: {reverse: false}
    }

    const [state, dispatch] = useReducer(RoomReducer, initialState);
    
    const {token} = useContext(userContext);
    // eslint-disable-next-line no-unused-vars
    const [cookies] = useCookies(["token"]);

    const setContacts = (contacts) => {
        dispatch({type: "UPDATE_CONTACT", payload: contacts})
    }

    const searchRoom = async (value) => {
        try {

            const res = await axios.get(`${api}/room/search/${value}`, {withCredentials: true, headers: {"Authorization": cookies.token}}).catch(err => console.log(err))   
            if(value.length > 0) {
                dispatch({type: "UPDATE_ROOMS", payload: res.data.rooms});
            } else {
                refresh_rooms();
            }

        } catch(err) {
            alert(err);
        }
    }

    const refresh_rooms = async (cb = () => {}, bool) => {
        try {
            let resRooms = await axios.get(`${api}/user/one`, { withCredentials: true, headers: {"Authorization": cookies.token} });
            let resContacts = await axios.get(`${api}/contact`, { withCredentials: true, headers: {"Authorization": cookies.token} });
            let chats = [...resRooms.data.user.rooms, ...resContacts.data.contacts];
            let roomConnections = chats.map(e => e.room_id);
            handleRoomConnections(roomConnections, token);

            let filter = [];

            for (let chat of chats) {
                let {data} = await axios.get(`${api}/message/last/${chat.room_id}`, {withCredentials: true, headers: {"Authorization": cookies.token}}).catch(err => alert(err));
                filter.push({data, chat});
                if(!bool) {
                    if (chat.contact_id) {
                        let {data} = await axios.get(`${api}/message/last/${chat.room_id}`, {withCredentials: true, headers: {"Authorization": cookies.token}}).catch(err => alert(err));
                        dispatch({ type: "CHAT_PEEKS", payload: { prop: chat.room_id, content: { messages: data.messages? data.messages : [] , online: chat.contact_id.online, bells: 0 } } })
                    } else {
                        let {data} = await axios.get(`${api}/message/last/${chat.room_id}`, {withCredentials: true, headers: {"Authorization": cookies.token}}).catch(err => alert(err));
                        dispatch({ type: "CHAT_PEEKS", payload: { prop: chat.room_id, content: { messages: data.messages? data.messages : [] , online: false, bells: 0 } } })
                    }
                }

                unreaded(chat.room_id);
            }
            let filtered = filter.sort((a,b) => new Date(a.data.messages ? a.data.messages[0].msgDate : 0) - new Date(b.data.messages ? b.data.messages[0].msgDate : 0))
            .map(e => {
                return e.chat;
            })

            dispatch({ type: "UPDATE_ROOMS", payload: filtered });
            
            cb();
        } catch (err) {
            alert(err);
        }
    }

    const setSelectedChat = (data) => {
        dispatch({ type: "SELECT_CHAT", payload: data });
    }

    const chatPhotos = async ({ room_id }) => {
        try {
            let photos = await axios.get(`${api}/upload/${room_id}`, { withCredentials: true, headers: {"Authorization": cookies.token} });
            let formatted = photos.data.files.map(e => {
                return { author: e.author, path: e.path }
            })

            dispatch({ type: "UPDATE_PHOTOS", payload: formatted })

        } catch (err) {
            alert(err)
        }
    }

    const setPeekMessages = async (room_id) => {
        let {data} = await axios.get(`${api}/message/last/${room_id}`, {withCredentials: true, headers: {"Authorization": cookies.token}}).catch(err => alert(err));
        if(data.messages) {
            dispatch({type: "UPDATE_PEEK", payload: {room_id, prop: "messages", value: data.messages}})
            dispatch({type: "UPDATE_PEEK", payload: {room_id, prop: "resetPeek", value: true}})

        }
    }

    const clearPhotos = async () => {
        dispatch({ type: "UPDATE_PHOTOS", payload: [] })
    }

    const setFocus = (bool, type) => {
        dispatch({ type: "FOCUS", payload: { bool, type } });
    }

    const setBell = (bell) => {
        dispatch({ type: "FOCUS", payload: { bell } });
    }

    const updatePeek = (room_id, prop, value) => {
        dispatch({ type: "UPDATE_PEEK", payload: { room_id, prop, value } })
    }

    const unreaded = async (room_id, cb = () => {}) => {
        try {
            let res = await axios.post(`${api}/message/unread`, { room_id }, { withCredentials: true, headers: {"Authorization": cookies.token} });
            updatePeek(room_id, "bells", res.data.count);
            cb({count: res.data.count})
        } catch (err) {
            alert(err)
        }
    }

    const setReaded = async (room_id) => {
        try {
            // eslint-disable-next-line no-unused-vars
            let res = await axios.put(`${api}/message/readed`, {room_id}, {withCredentials: true, headers: {"Authorization": cookies.token}});
            dispatch({type: "UPDATE_PEEK", payload: {room_id, prop: "bells", value: 0}})
        } catch(err) {
            alert(err)
        }
    }

    const setShowBar = (bool) => {
        dispatch({type:"SHOW_BAR", payload: bool})
    }

    return <roomsContext.Provider value={{
        selected: state.selectedChat,
        chats: state.chats,
        setSelectedChat,
        refresh_rooms,
        chatPhotos,
        photos: state.photos,
        clearPhotos,
        messages: state.messages,
        setFocus,
        focus: state.focus,
        chatPeeks: state.chatPeeks,
        updatePeek,
        unreaded,
        setReaded,
        setBell,
        bellState: state.focus.bell,
        setPeekMessages,
        contacts: state.contacts,
        setContacts,
        size: state.size,
        searchRoom,
        setShowBar,
        showBar: state.showBar 
    }} > {children} </roomsContext.Provider>
}

export default ProviderRoom;


