import { MESSAGE_UPLOAD, DELETE_UPLOAD } from '../actions';


// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    const { payload, type } = action;
    switch (type) {

        case MESSAGE_UPLOAD:
            return {
                ...state,
                messages: [...state.messages,payload]  
            }
        case DELETE_UPLOAD:
            return {
                ...state,
                messages: payload  
            }
        default: 
        return state
    }

}