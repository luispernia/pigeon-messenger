import { REGISTER_USER, LOGIN_USER, UPDATE_USER } from "../actions";

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    const { payload, type } = action;

    switch (type) {
        case REGISTER_USER:
            return {
                ...state,
                user: payload.username
            }

        case LOGIN_USER:
            console.log("login");
            return {
                ...state,
                user: payload.user,
                token: payload.token
            }
        case UPDATE_USER:
            return {
                ...state,
                user: payload.user
            }

        default:
            return state
    }

}