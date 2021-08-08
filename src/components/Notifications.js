import "./_Notifications.scss"
import React, { useContext } from 'react';
import bellsContext from '../services/context/BellContext';
import userContext from "../services/context/UserContext";
import { acceptContact, rejectContact } from "../services/sockets/sockets";



function Notifications() {

    const { bells } = useContext(bellsContext);


    return (
        <div className="box notifications">
            {bells.map(e => {
                return <Bell key={e._id} data={e} />
            })}
            <div>
                <h2>Notifications <span className="bells-count"> {bells.length} </span></h2>
            </div>
        </div>
    )
}

function Bell({ data }) {

    const { request } = data

    switch (request) {
        case "REQUEST":
            return <BellComponent data={data} request={request} opts={true} />

        case "REQUEST_ACCEPTED":
            return <BellComponent data={data} request={request} opts={false} />

        case "CONTACT_ADDED":
            return <BellComponent data={data} request={request} opts={false} />

        case "REQUEST_DECLINED":
            return <BellComponent data={data} request={request} opts={false} />

        default:
            return "";
    }
}

function BellComponent({ data, request, opts }) {
    const { img, date, requester, title, _id } = data;

    const { token } = useContext(userContext)

    let hour = new Date(date).getHours();
    let minutes = new Date(date).getMinutes();
    let requesterFormatted = requester.split("/")[0];

    return (
        <div className={`bell ${request.toLowerCase()}`}>
            <img src={`http://localhost:8080/upload/user/${img}?token=${token}`} alt={`${requesterFormatted} img`} />
            <div className="bell-body">
                <div className="bell-profile">
                    <p>@{`${requesterFormatted}`}</p>
                </div>
                <div className="bell-content">
                    <p>{`${title}`}</p>
                    {opts ? (
                        <div className="bell-options">
                            <button onClick={() => acceptContact({ id: _id, token })} className="accept button">Accept</button>
                            <button onClick={() => rejectContact({ id: _id, token })} className="reject button">Reject</button>
                        </div>
                    ) : ""}

                </div>
            </div>
            <p>{`${hour}:${minutes.toString().length > 1 ? minutes : "0" + minutes}`}</p>
        </div>
    )
}

export default Notifications
