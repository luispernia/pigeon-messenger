import { REGISTER_USER, LOGIN_USER, UPDATE_USER, SIGNOUT_USER, UPDATE_ALERT, DELETE_ALERT } from "../actions";

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    const { payload, type } = action;

    switch (type) {
        case REGISTER_USER:
            return {
                ...state,
                user: payload
            }

        case LOGIN_USER:    
            return {
                ...state,
                user: {name: payload.user.name, email: payload.user.email, img: payload.user.img, _id: payload.user._id, status: payload.user.status, username: payload.user.username,   },
                token: payload.token
            }

        case UPDATE_USER:

            return {
                ...state,
                user: {name: payload.user.name, email: payload.user.email, img: payload.user.img, _id: payload.user._id, status: payload.user.status, username: payload.user.username,   },
                token: payload.token
            }   

        case SIGNOUT_USER: 
            return {
                ...state,
                user: null,
                token: null
            }

        case UPDATE_ALERT: 
            return {
                ...state,
                alerts: [...state.alerts, ...[payload]]
            }
        case DELETE_ALERT: 
            return {
                ...state,
                toDelete: [...state.toDelete, ...payload.alerts]
            }
        default:
            return state
    }

}