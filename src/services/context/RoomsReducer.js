import { UPDATE_ROOMS, SELECT_CHAT, UPDATE_PHOTOS, UPDATE_MESSAGES, FOCUS } from "../actions";

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    const { payload, type } = action;
    switch (type) {
        case UPDATE_ROOMS:
            return {
                ...state,
                chats: [...payload]
            }
        case SELECT_CHAT:
            return {
                ...state,
                selectedChat: payload
            }
        case UPDATE_PHOTOS:
            return {
                ...state,
                photos: payload
            }
        case UPDATE_MESSAGES: 
            return  {
                ...state,
                messages: payload
            }
        case FOCUS: 
            return  {
                ...state,
                focus: payload
            }
        default:
            return state
    }

}