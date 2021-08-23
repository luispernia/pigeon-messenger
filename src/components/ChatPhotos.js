import React, { useContext } from 'react'
import userContext from '../services/context/UserContext'

    function ChatPhotos({photos}) {

    const {token} = useContext(userContext);

    return (
        <div className="photos">
            {photos.map((e, i) => {
                return (
                    <div className="photo">
                        <p>Author: {e.author.username}</p>
                        <img src={`https://pigeon-messenger-server.herokuapp.com/upload/docs/${e.path}?token=${token}`} alt="" />
                    </div>
                )
            })}
        </div>
    )
}

export default ChatPhotos
