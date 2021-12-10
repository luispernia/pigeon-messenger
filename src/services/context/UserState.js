import { useReducer } from "react";
import axios from "axios";
import userContext from "./UserContext";
import UserReducer from "./UserReducer";
import {api} from "../config";
import {useCookies} from "react-cookie";

axios.defaults.withCredentials = true;

function ProvideUser({ children }) {

    const initialState = {
        user: null,
        token: null,
        alerts: [],
        toDelete: []
    }

    const [state, dispatch] = useReducer(UserReducer, initialState);
    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookie] = useCookies(["token"]);

    const setAlert = (data) => {
        dispatch({ type: "UPDATE_ALERT", payload: data });

    }

    const signUpEmail = async ({ name, email, password }, cb) => {
        try {
            let data = { email, password, name };

            let response = await axios.post(`${api}/user`, data)
            .catch(({response}) => {
                console.log(response);
                cb({ok: false, err: "Email already registered"});
            })
            
            let login = await axios.post(`${api}/login`, {email: response.data.user.email, password}, {withCredentials: true})

            .catch(({response}) => {
                console.log(response);
                cb({ok: false, err: "Error"});
            })

            setCookie("token", login.data.token, {path: "/"});

            dispatch({ type: "REGISTER_USER", payload: {user: login.data.user, token: login.data.token}});

            cb({ok: true});
        } catch (err) {
            console.log(err);
        }
    }

    const signOut = async (cb) => {
        try {
            // eslint-disable-next-line no-unused-vars
            setCookie("token", null, {path: "/"});
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
            let response = await axios.post(`${api}/login`, data, { withCredentials: true })
            .catch(({response}) => {
                if(response.data.err) {
                    cb({ ok: false });
                    setAlert({ text: response.data.err })
                    return;
                }
            })

            setCookie("token", response.data.token, {path: "/"});

            let userDB = await axios.get(`${api}/user/one`, { withCredentials: true, headers: {"Authorization": response.data.token}});
            
            dispatch({ type: "LOGIN_USER", payload: { user: userDB.data.user, token: response.data.token } });

            cb({ ok: true });   

        } catch (err) {
            cb({ ok: false });
            console.log(err);
        }
    }

    const googlelogin = async (data, cb) => {
        try {
            let res = await axios.post(`${api}/google`, {idtoken: data}, {withCredentials: true}).catch(err => console.log(err));
            if(!res.data.ok) {
                cb({ok: false, err: res.err})
                return;
            }

            setCookie("token", res.data.token, {path: "/"});

            dispatch({type: "LOGIN_USER", payload: {user: res.data.user, token: res.data.token}});
            cb({ok: true, user: res.data.user});
        } catch(err) {
            cb({ok: false})
        }
    }

    const finishSettings = async (data,cb) => {
        try {
            // eslint-disable-next-line no-unused-vars
            let res = await axios.put(`${api}/user/${data.id}`, {username: data.username}, {withCredentials: true, headers: {"Authorization": cookies.token}});
            if(!res.data.ok) {
                cb({ok: false, err: res.err});
                return;
            }
            cb({ok: true}) 
        } catch(err) {
            cb({ok: false})
        }
    }

    const refresh_token = async (data) => {
        try {
            let res = await axios.post(`${api}/refresh_token`, {}, { withCredentials: true, headers: {"Authorization": cookies.token} });
            
            if (data) {
                updateUser({ user: data.user, token: res.data.token }, () => { })
            }

            setCookie("token", res.data.token, {path: "/"});

        } catch (err) {
            setAlert({ text: err });
        }
    }

    const deleteAlert = (alerts, cb) => {
        dispatch({type: "DELETE_ALERT", payload: {alerts}})
        cb();
    }


    return <userContext.Provider value={{
        user: state.user,
        token: state.token,
        signUpEmail,
        loginEmail,
        googlelogin,
        updateUser,
        signOut,
        setAlert,
        alerts: state.alerts,
        refresh_token,
        finishSettings,
        deleteAlert,
        toDelete: state.toDelete
    }}>{children}</userContext.Provider>
}

export { ProvideUser };

