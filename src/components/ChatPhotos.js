import React, { useContext } from 'react'
import userContext from '../services/context/UserContext'
import "./_ChatPhotos.scss"

function ChatPhotos({photos}) {

    const {token} = useContext(userContext);

    return (
        <div className="photos">
            {photos.map((e, i) => {
                return (
                    <div className="photo">
                        <p>Author: {e.author.username}</p>
                        <img src={`http://localhost:8080/upload/docs/${e.path}?token=${token}`} alt="" />
                    </div>
                )
            })}
        </div>
    )
}

export default ChatPhotos
