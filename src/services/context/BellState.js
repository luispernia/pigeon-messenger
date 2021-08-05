import { useReducer } from "react";
import axios from "axios";
import bellsContext from "./BellContext";
import BellReducer from "./BellReducer";
axios.defaults.withCredentials = true;

function ProvideBell({children}) {
    
    const initialState = {
        bells: []
    }

    const [state, dispatch] = useReducer(BellReducer, initialState);
    
    function addBell(bell, cb) {
        dispatch({type: "ADD_BELL", payload: bell});
        cb()
    }



    return <bellsContext.Provider value={{bells: state.bells, addBell}} > {children} </bellsContext.Provider>
}

export default ProvideBell;