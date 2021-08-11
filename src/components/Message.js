import React, { useContext } from 'react'
import userContext from '../services/context/UserContext'

function Message({ data }) {

    const { user, token } = useContext(userContext);



    return (
        <div className={`message ${user.username === data.author.username ? "right" : ""}`}>
            <div className="user">
                <img src={`http://localhost:8080/upload/user/${data.author.img}?token=${token}`} alt="" />
                <p>{data.author.username}</p>
            </div>

            {data.files.length > 0 ? (
                <div className="image">
                    {data.files.map(e => {
                        return <img src={`http://localhost:8080/upload/docs/${e.path}?token=${token}`} alt={`loading`} />
                    })}
                    <div className="message-content">
                        <div className="date">
                            {(() => {
                                if (new Date(data.msgDate).getDate() === new Date().getDate()) {
                                    let date = new Date(data.msgDate);
                                    let formatted = `${date.getHours()}:${date.getMinutes()}`;

                                    return <p style={{ background: "transparent", color: "var(--dark-gray)" }}><span><i class="bi bi-clock-history"></i></span> {formatted}</p>;
                                }
                            })()}
                        </div>
                        <p>{data.text}</p>
                    </div>
                </div>

            ) : (
                <div className="message-content">
                    <div className="date">
                        {(() => {
                            if (new Date(data.msgDate).getDate() === new Date().getDate()) {
                                let date = new Date(data.msgDate);
                                let formatted = `${date.getHours()}:${date.getMinutes().toString().length > 1? date.getMinutes().toString() : "0"+date.getMinutes().toString()}`;

                                return <p className="pdate">{formatted}</p>;
                            }
                        })()}
                    </div>
                    <div className="text">
                        <p>{data.text}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Message
