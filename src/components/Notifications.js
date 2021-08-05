import "./_Notifications.scss"
import React, { useContext } from 'react';
import bellsContext from '../services/context/BellContext';
import axios from "axios";
import userContext from "../services/context/UserContext";

function Notifications() {

    const {bells} = useContext(bellsContext);
    
    return (
        <div className="box notifications">
            <h2>Notifications</h2>
            {bells.map(e => {
                return <Bell data={e}/>
            })}
        </div>
    )
}

function Bell({data}) {
    const {request, img, date, requester, title, _id } = data;
    const {token} = useContext(userContext)

    switch(request) {
        case "REQUEST": 
        return (
            <div className="bell request">
                <img src={`http://localhost:8080/upload/user/${img}?token=${token}`} alt={`${requester} img`} />
                <p>{`${title}`}</p>
            </div>  
        )
        default: 
        return "";
        break
    }

}

export default Notifications
