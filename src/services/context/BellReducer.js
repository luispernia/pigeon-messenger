import { ADD_BELL } from "../actions";


// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    const { payload, type } = action;
    switch (type) {
        case ADD_BELL:
            return {
                ...state,
                bells: [...state.bells, ...[payload]]
            }
    
        default:
            break;
    }
}