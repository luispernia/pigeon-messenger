import React, { useContext } from 'react'
import userContext from '../services/context/UserContext'

function Message({data}) {

    const {user, token} = useContext(userContext);
  
    return (
        <div className={`message ${user.username === data.author.username? "right" : ""}`}>
            <div className="user">
                <img src={`http://localhost:8080/upload/user/${data.author.img}?token=${token}`} alt="" />
                <p>@{data.author.username}</p>
            </div>
            <div className="text">
                {data.text}
                {data.files.length > 0? ( data.files.map(e => {
                    return <img src={`http://localhost:8080/upload/docs/${e.path}?token=${token}`} alt={`loading`} />
                })) : ""}
            </div>
        </div>
    )
}

export default Message
