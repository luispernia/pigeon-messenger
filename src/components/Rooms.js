import React, {useContext} from 'react'
import roomsContext from '../services/context/RoomContext';
import userContext from '../services/context/UserContext';
import "./_Rooms.scss";

function Rooms() {

    const {rooms} = useContext(roomsContext);    
    
    return (
        <div className="box rooms">
            <h2>Rooms</h2>
            <div className="list">
                {rooms.map(e => {
                    return (
                    <div>
                        <h4>{e.name}</h4>   


                    </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Rooms
