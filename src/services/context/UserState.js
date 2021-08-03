import { useReducer, useEffect } from "react";
import axios from "axios";

import userContext from "./UserContext";
import UserReducer from "./UserReducer";

function ProvideUser({ children }) {

    const initialState = {
        user: null,
        token: null
    }

    const [state, dispatch] = useReducer(UserReducer, initialState);

    const signInEmail = async ({ username, name, email, password }, cb) => {
        try {
            let data = { email, password, username, name };
            let response = await axios.post("http://localhost:8080/user", data);
            dispatch({ type: "REGISTER_USER", payload: response.data.user.username });
            cb();
        } catch (err) {
            alert(err);
        }
    }

    const loginEmail = async ({ email, password }, cb) => {
        try {
            let data = { email, password };
            let response = await axios.post("http://localhost:8080/login", data);
            dispatch({ type: "LOGIN_USER", payload: response.data });
            cb();
        } catch (err) {
            alert(err);
        }
    }

    const updateUser = async (id, data, cb) => {
        try {
            let res = await axios.put(`http://localhost:8080/user/${id}`, data);
            dispatch({type: "UPDATE_USER", payload: res.user});
            cb();
        } catch(err) {
            alert(err)
        }
    }



    return <userContext.Provider value={{ user: state.user, token: state.token, signInEmail, loginEmail, updateUser}}>{children}</userContext.Provider>
}

export { ProvideUser };

