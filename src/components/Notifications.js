import "./_Notifications.scss"
import React, { useContext } from 'react';
import bellsContext from '../services/context/BellContext';
import axios from "axios";

function Notifications() {

    const {bells} = useContext(bellsContext);

    return (
        <div className="box notifications">
            <h2>Notifications</h2>
            {bells.map(e => {
                return (
                    <p>request friend {e.name} </p>
                )
            })}
        </div>
    )
}

export default Notifications
