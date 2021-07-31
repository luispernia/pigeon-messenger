import React from 'react'
import Pigeon from '../services/Pigeon/PigeonAPI';

const { rooms } = new Pigeon();


function Landing() {
    
    return (
        <div>
            <h1>Pigeon Messenger</h1>
            <p>Lightweight Messages</p>
            <button onClick={rooms}>Magic</button>
        </div>
    )
}

export default Landing;