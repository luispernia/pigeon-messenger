import {
    UPDATE_ROOMS,
    SELECT_CHAT,
    UPDATE_PHOTOS,
    UPDATE_MESSAGES,
    FOCUS,
    CHAT_PEEKS,
    UPDATE_PEEK,
    UPDATE_CONTACT,
    SHOW_BAR
} from "../actions";

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
            return {
                ...state,
                messages: [...payload.messages, ...state.messages],
                size: payload.size
            }
        case FOCUS:
            return {
                ...state,
                focus: { ...state.focus, ...payload }
            }
        case CHAT_PEEKS:
            return {
                ...state,
                chatPeeks: { ...state.chatPeeks, [payload.prop]: payload.content }
            }
        case UPDATE_PEEK:
            return {
                ...state,
                chatPeeks: { ...state.chatPeeks, [payload.room_id]: { ...state.chatPeeks[payload.room_id], [payload.prop]: payload.value } }
            }
        case UPDATE_CONTACT:
            return {
                ...state,
                contacts: payload
            }
        case SHOW_BAR:
            return {
                ...state,
                showBar: payload
            }
        default:
            return state
    }

}