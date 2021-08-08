import {UPDATE_ROOMS } from "../actions";

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    const { payload, type } = action;
    console.log(payload);
    switch(type) {
        case UPDATE_ROOMS: 
            return {
                ...state,
                rooms: [...state.rooms, ...payload]
            }

        default: 
        return state
    }        

}