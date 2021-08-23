import { useReducer } from "react";
import axios from "axios";
import userContext from "./UserContext";
import UserReducer from "./UserReducer";
axios.defaults.withCredentials = true;

function ProvideUser({ children }) {

    const initialState = {
        user: null,
        token: null,
        alerts: [],
        toDelete: []
    }

    const [state, dispatch] = useReducer(UserReducer, initialState);

    const setAlert = (data) => {
        dispatch({ type: "UPDATE_ALERT", payload: data });

    }

    const signUpEmail = async ({ name, email, password }, cb) => {
        try {
            let data = { email, password, name };
            let response = await axios.post("https://pigeon-messenger-server.herokuapp.com/user", data)

            .catch(({response}) => {
                console.log(response);
                cb({ok: false, err: "Email already registered"});
            })

            let login = await axios.post("https://pigeon-messenger-server.herokuapp.com/login", {email: response.data.user.email, password}, {withCredentials: true})
            .catch(({response}) =>{
                console.log(response);
                cb({ok: false, err: "Error"})
            })

            dispatch({ type: "REGISTER_USER", payload: {user: login.data.user, token: login.data.token}});
            cb({ok: true});
        } catch (err) {
            console.log(err);
        }
    }

    const signOut = async (cb) => {
        try {
            // eslint-disable-next-line no-unused-vars
            let res = await axios.post("https://pigeon-messenger-server.herokuapp.com/signOut", {}, { withCredentials: true });
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
            let response = await axios.post("https://pigeon-messenger-server.herokuapp.com/login", data, { withCredentials: true })
            .catch(({response}) => {
                if(response.data.err) {
                    cb({ ok: false });
                    setAlert({ text: response.data.err })
                    return;
                }
            })

            let userDB = await axios.get("https://pigeon-messenger-server.herokuapp.com/user/one", { withCredentials: true });
            dispatch({ type: "LOGIN_USER", payload: { user: userDB.data.user, token: response.data.token } });

            cb({ ok: true });   

        } catch (err) {
            cb({ ok: false });
            console.log(err);
        }
    }

    const googlelogin = async (data, cb) => {
        try {
            let res = await axios.post(`https://pigeon-messenger-server.herokuapp.com/google`, {idtoken: data}, {withCredentials: true}).catch(err => console.log(err));
            dispatch({type: "LOGIN_USER", payload: {user: res.data.user, token: res.data.token}});
            cb({ok: true, user: res.data.user});
        } catch(err) {
            cb({ok: false})
        }
    }

    const finishSettings = async (data,cb) => {
        try {
            // eslint-disable-next-line no-unused-vars
            let res = await axios.put(`https://pigeon-messenger-server.herokuapp.com/user/${data.id}`, {username: data.username});
            cb({ok: true}) 
        } catch(err) {
            cb({ok: false})
        }
    }

    const refresh_token = async (data) => {
        try {
            let res = await axios.post("https://pigeon-messenger-server.herokuapp.com/refresh_token", {}, { withCredentials: true });
            if (data) {
                updateUser({ user: data.user, token: res.data.token }, () => { })
            }
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

