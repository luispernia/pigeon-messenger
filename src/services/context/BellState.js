import { useContext, useReducer } from "react";
import axios from "axios";
import bellsContext from "./BellContext";
import BellReducer from "./BellReducer";
import roomsContext from "./RoomContext";
import {api} from "../config";
import {useCookies} from "react-cookie";
axios.defaults.withCredentials = true;

function ProvideBell({ children }) {

    const initialState = {
        bells: [],
   
    }

    const [state, dispatch] = useReducer(BellReducer, initialState);
    const { refresh_rooms } = useContext(roomsContext);
    const [cookies] = useCookies(["token"]);

    const refresh_bell = async () => {
        try {

            let res = await axios.get(`${api}/bell`, { withCredentials: true, headers: {"Authorization": cookies.token} });
            dispatch({ type: "UPDATE_BELL", payload: res.data.bells });

        } catch (err) {
            alert(err)
        }
    }

    const setBells = async () => {
        try {
            // eslint-disable-next-line no-unused-vars
            let res = await axios.put(`${api}/bell/readed`, {}, { withCredentials: true, headers: {"Authorization": cookies.token} })
            refresh_bell();
        } catch (err) {
            alert(err)
        }
    }

    const addBell = async ({ bell, ring }, cb) => {
        try {

            const { request } = bell;

            switch (request) {
                case "REQUEST":
                    refresh_bell();
                    cb({ ring });
                    break;

                case "ANNOUNCEMENT":
                    refresh_bell();
                    cb({ ring });
                    break;

                case "REQUEST_DECLINED":
                    refresh_bell();
                    cb({ ring });
                    break;
                case "CONTACT_ADDED":
                    refresh_rooms();
                    refresh_bell();
                    cb({ ring });
                    break;
                case "REQUEST_ACCEPTED":
                    refresh_rooms();
                    refresh_bell();
                    // here update the rooms or contacts state
                    cb({ ring });
                    break;

                case "REQUEST_ROOM":
                    refresh_rooms();
                    refresh_bell();
                    // here update the rooms or contacts state
                    cb({ ring });
                    break;

                case "ROOM_DECLINED":
                    refresh_bell();
                    // here update the rooms or contacts state
                    cb({ ring });
                    break;

                case "REFRESH":
                    refresh_bell();
                    // here update the rooms or contacts state
                    cb({ ring });
                    break;
                case "ADDED_TO_ROOM":
                    refresh_rooms();
                    refresh_bell();
                        // here update the rooms or contacts state
                    cb({ ring });
                    break;
                case "REFRESH_ROOMS":
                    refresh_rooms();
                        refresh_bell();
                            // here update the rooms or contacts state
                        cb({ ring });
                        break;
                default:
                    break
            }
        } catch (err) {
            alert(err);
        }

    }

  

    return <bellsContext.Provider value={{
        bells: state.bells,
        addBell,
        refresh_bell,
        setBells,
    
    }} > {children} </bellsContext.Provider>
}

export default ProvideBell;