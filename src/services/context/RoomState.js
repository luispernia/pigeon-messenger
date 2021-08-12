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
        photos: [],
        focus: {bool: false, type: ""}
    }
    
    const [state, dispatch] = useReducer(RoomReducer, initialState);
    
    const roomMessages = async ({room_id}) => {
        try {
            let res = await axios.get(`http://localhost:8080/message/${room_id}`, {withCredentials: true}); 
            dispatch({type: "UPDATE_MESSAGES", payload: res.data.message})
    
        } catch(err) {
            alert(err);
        }
    }

    const refresh_rooms = async () => {
        try {
            let resRooms = await axios.get("http://localhost:8080/user/one", { withCredentials: true });
            let resContacts = await axios.get("http://localhost:8080/contact", { withCredentials: true });
            let chats = [...resRooms.data.user.rooms, ...resContacts.data.contacts];
            let roomConnections = chats.map(e => e.room_id);
            handleRoomConnections(roomConnections);
            let chatFormatted = [];
            for(let i = 0; i < chats.length; i++) {
                axios.get(`http://localhost:8080/message/${chats[i].room_id}`, {withCredentials: true})
                .then(res => {
                    let {data} = res;
                    if(data.message.length > 1) {
                        chatFormatted.push({...chats[i], lastMessages: [{post: data.message[data.message.length - 1], pre: data.message[data.message.length - 2]}]}) 
                    } else {
                        chatFormatted.push({...chats[i]});
                    }

                    dispatch({type: "UPDATE_ROOMS", payload: chatFormatted});

                })
                .catch(err => {
                    alert(err)
                })
            }
            
           
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

    const setFocus = (bool, type) => {
        dispatch({type: "FOCUS", payload: {bool, type}});
    }
    

    return <roomsContext.Provider value={{ selected: state.selectedChat, chats: state.chats, setSelectedChat , refresh_rooms, chatPhotos, photos: state.photos ,clearPhotos, roomMessages, messages: state.messages, setFocus, focus: state.focus}} > {children} </roomsContext.Provider>
}

export default ProviderRoom;


