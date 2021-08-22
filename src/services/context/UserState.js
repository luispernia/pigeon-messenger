import { useReducer } from "react";
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
            let login = await axios.post("http://localhost:8080/login", {email: response.data.user.email, password}, {withCredentials: true})
            .catch(({response}) =>{
                console.log(response);
            })
            
            dispatch({ type: "REGISTER_USER", payload: {user: login.data.user, token: login.data.token}});
            cb();
        } catch (err) {
            alert(err);
        }
    }

    const signOut = async (cb) => {
        try {
            // eslint-disable-next-line no-unused-vars
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
            console.log(email);
            let response = await axios.post("http://localhost:8080/login", data, { withCredentials: true })
            .catch(({response}) => {
                if(response.data.err) {
                    cb({ ok: false });
                    setAlert({ text: response.data.err })
                    return;
                }
            })


            let userDB = await axios.get("http://localhost:8080/user/one", { withCredentials: true });
            dispatch({ type: "LOGIN_USER", payload: { user: userDB.data.user, token: response.data.token } });

            cb({ ok: true });   

        } catch (err) {
            cb({ ok: false });
        }
    }

    const googlelogin = async (data, cb) => {
        try {
            let res = await axios.post(`http://localhost:8080/google`, {idtoken: data}, {withCredentials: true}).catch(err => console.log(err));
            dispatch({type: "LOGIN_USER", payload: {user: res.data.user, token: res.data.token}});
            cb({ok: true, user: res.data.user});
        } catch(err) {
            cb({ok: false})
        }
    }

    const finishSettings = async (data,cb) => {
        try {
            // let res = await axios.   
        } catch(err) {
            cb({ok: false})
        }
    }

    const refresh_token = async (data) => {
        try {
            let res = await axios.post("http://localhost:8080/refresh_token", {}, { withCredentials: true });
            if (data) {
                updateUser({ user: data.user, token: res.data.token }, () => { })
            }
        } catch (err) {
            setAlert({ text: err });
        }
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
        refresh_token
    }}>{children}</userContext.Provider>
}

export { ProvideUser };

