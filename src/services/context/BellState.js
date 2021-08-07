import { useContext, useReducer } from "react";
import userContext from "./UserContext";
import axios from "axios";
import bellsContext from "./BellContext";
import BellReducer from "./BellReducer";
axios.defaults.withCredentials = true;

function ProvideBell({children}) {

    const initialState = {
        bells: []
    }

    const [state, dispatch] = useReducer(BellReducer, initialState);

    const refresh_bell = async () => {
        try {
            let res = await axios.get("http://localhost:8080/bell", {withCredentials: true});
            dispatch({type: "UPDATE_BELL", payload: res.data.bells})
        } catch(err) {
            alert(err)
        }
    
    }

    const addBell = async ({bell}, cb) => {
        try{
            
            const {request} = bell;

            switch(request) {
                case "REQUEST":
                    dispatch({type: "ADD_BELL", payload: bell});
                    cb();
                    break;

                case "ANNOUNCEMENT":
                    dispatch({type: "ADD_BELL", payload: bell});
                    cb();
                    break;

                case "REQUEST_DECLINED":
                    dispatch({type: "ADD_BELL", payload: bell});
                    cb();
                    break;
                case "CONTACT_ADDED": 
                    refresh_bell();
                    dispatch({type: "ADD_BELL", payload: bell})
                    cb();
                    break;
                case "REQUEST_ACCEPTED":
                    dispatch({type: "ADD_BELL", payload: bell});
                    // here update the rooms or contacts state



                    cb();
                    break;
    
                default: 
    
                break
            }
        } catch(err) {
            alert(err);
        }
      
    }



    return <bellsContext.Provider value={{bells: state.bells, addBell, refresh_bell}} > {children} </bellsContext.Provider>
}

export default ProvideBell;