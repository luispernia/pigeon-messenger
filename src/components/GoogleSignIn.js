import React, {useContext} from 'react'
import GoogleLogin from 'react-google-login';
import userContext from '../services/context/UserContext';
import {client} from "../services/config";

function GoogleSignIn({history, type, loading}) {

    const {googlelogin, setAlert} = useContext(userContext); 
 
    
    const login = (response) => {
        loading("Loading");

        googlelogin(response.tokenObj.id_token, (res) => {
            if(!res.ok) {
                loading("done");
                setAlert({text: "Error while login"});
                    return;
            }

            if(res.user.username === res.user.email) {
                history.replace("/finish");
            } else {
                history.replace("/chat");
            }

        })

    }

    const fail = () => {
        console.log("fail request");
    }


    return (
        <> <div className="google-button">
            <GoogleLogin
                clientId={client}
                buttonText={type === "login"? "Login with google" : "Register with google"}
                onSuccess={login}
                onFailure={fail}
            />
            </div>
        </>
    )
}

export default GoogleSignIn
