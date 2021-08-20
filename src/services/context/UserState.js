import { useReducer, useEffect } from "react";
import axios from "axios";
import userContext from "./UserContext";
import UserReducer from "./UserReducer";
axios.defaults.withCredentials = true;

function ProvideUser({ children }) {

    const initialState = {
        user: null,
        token: null,
        alerts: []
    }

    const [state, dispatch] = useReducer(UserReducer, initialState);

    const setAlert = (data) => {
        dispatch({ type: "UPDATE_ALERT", payload: data });

    }

    const signUpEmail = async ({ username, name, email, password }, cb) => {
        try {
            let data = { email, password, username, name };
            let response = await axios.post("http://localhost:8080/user", data);
            dispatch({ type: "REGISTER_USER", payload: response.data.user.username });
            cb();
        } catch (err) {
            alert(err);
        }
    }

    const signOut = async (cb) => {
        try {
            let res = await axios.post("http://localhost:8080/signOut", {}, { withCredentials: true });
            setTimeout(() => {
                dispatch({ type: "SIGNOUT_USER", payload: null });
            }, 2000);
            cb();
        } catch (err) {
            console.log(err);
        }
    }

    const updateUser = (data, cb) => {
        dispatch({ type: "UPDATE_USER", payload: data });
        cb();
    }

    const loginEmail = async ({ email, password }, cb) => {
        try {
            let data = { email, password };
            let response = await axios.post("http://localhost:8080/login", data, { withCredentials: true });
            let userDB = await axios.get("http://localhost:8080/user/one", { withCredentials: true });
            dispatch({ type: "LOGIN_USER", payload: { user: userDB.data.user, token: response.data.token } });
            cb();
        } catch (err) {
            alert(err);
        }
    }

    const refresh_token = async () => {
        try {
            let res = await axios.post("http://localhost:8080/refresh_token", {}, { withCredentials: true });

        } catch (err) {
            setAlert({ text: err });
        }
    }


    return <userContext.Provider value={{
        user: state.user,
        token: state.token,
        signUpEmail,
        loginEmail,
        updateUser,
        signOut,
        setAlert,
        alerts: state.alerts,
        refresh_token
    }}>{children}</userContext.Provider>
}

export { ProvideUser };

