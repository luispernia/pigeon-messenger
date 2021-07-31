import { createContext, useContext, useState, useEffect } from "react";
import Pigeon from "../Pigeon/PigeonAPI";

const auth = new Pigeon().user; // New Instance 

const authContext = createContext(); // Create Context

function ProvideAuth({ children }) { // Provide Context
    const auth = useProvideAuth();

    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

const useAuth = () => { // Using Context
    return useContext(authContext);
}

function useProvideAuth() { // Auth Methods From Class
    const [userData, setUser] = useState("");

    const signIn = async (email, password) => {
        let user = await auth.signIn(email, password);
        setUser(user.body);
    }

    useEffect(() => {
        const unsubscribe = () => auth.onAuthStatusChanged((user) => {
            if(user) {
                setUser(user);
                console.log(userData);
            } else {
                setUser(false);
            }
        })


        return () => unsubscribe();

    })

    return {
        user: userData,
        signIn
    }


}



export { useContext, ProvideAuth, useAuth };

