import { useContext, useReducer } from "react";
import userContext from "./UserContext";
import axios from "axios";
import bellsContext from "./BellContext";
import BellReducer from "./BellReducer";
axios.defaults.withCredentials = true;

function ProvideBell({children}) {

    const {user} = useContext(userContext);

    const initialState = {
        bells: []
    }

    const [state, dispatch] = useReducer(BellReducer, initialState);
    
    const addBell = async (bell, cb) => {
        try{
            let {request, requester, img, text} = bell;
            let res;

            switch(request) {
                case "REQUEST":
                    res = await axios.post("http://localhost:8080/bell", {request, title: `${requester} send you contact request`, text, img, requester}, {withCredentials: true});
                    dispatch({type: "ADD_BELL", payload: res.data.bell});
                    cb();
                    break;

                case "ANNOUNCEMENT":
                    res = await axios.post("http://localhost:8080/bell", {request, title: `A Pigeon delivering some new stuff 😎`, text, img, requester}, {withCredentials: true});
                    dispatch({type: "ADD_BELL", payload: res.data.bell});
                    cb();
                    break;

                case "REQUEST_DECLINED":
                    res = await axios.post("http://localhost:8080/bell", {request, title: `${requester} Declined your request`, text, img, requester}, {withCredentials: true});
                    dispatch({type: "ADD_BELL", payload: res.data.bell});
                    cb();
                    break;

                case "REQUEST_ACCEPTED":
                    res = await axios.post("http://localhost:8080/bell", {request, title: `${requester} Accept your contact request`, text, img, requester}, {withCredentials: true});
                    dispatch({type: "ADD_BELL", payload: res.data.bell});
                    cb();
                    break;
    
                default: 
    
                break
            }
        } catch(err) {
            alert(err);
        }
      
    }

    const refresh_bell = async () => {
        try {
            let res = await axios.get("http://localhost:8080/bell", {withCredentials: true});
            console.log(res);
            dispatch({type: "UPDATE_BELL", payload: res.data.bells})
        } catch(err) {
            alert(err)
        }
    
    }


    return <bellsContext.Provider value={{bells: state.bells, addBell, refresh_bell}} > {children} </bellsContext.Provider>
}

export default ProvideBell;