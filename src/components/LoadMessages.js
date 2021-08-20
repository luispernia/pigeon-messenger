import React, { useState, useEffect, useContext, useRef } from 'react'
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import Message from './Message';
import roomsContext from '../services/context/RoomContext';
import socket from '../services/sockets/socketConfig';
import messagesContext from '../services/context/MessagesContext';

function LoadMessages({ height }) {

    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(10);
    const [items, setItems] = useState([]);
    const { selected } = useContext(roomsContext);
    const {messages, clear_queue} = useContext(messagesContext);
    const scrollRef = useRef();

    const fetchMessages = (reset) => {
        axios.get(`http://localhost:8080/message/${selected ? selected.room_id : ""}?from=${reset ? 0 : page - 10}&to=${reset ? 10 : page}`)
            .then((res) => {

                const result = res.data;

                if (page >= result.count) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }

                setPage(prev => {
                    return reset ? 10 : prev + 10
                })

                if (reset) {
                    setItems([...result.message]);
                } else {
                    setItems([...items, ...result.message]);
                }

            })
    }

    useEffect(() => {
        fetchMessages();
    }, [])

    useEffect(() => {
        clear_queue();
        fetchMessages(true);
    }, [selected])

    const down = () => {
        scrollRef.current.scrollTop = 0;
    }

    return (
        <>
            <div style={{ maxHeight: height, height: "100%" }} className="messages">
                <div ref={scrollRef} style={{
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    maxHeight: "100%"
                }} id="messages-overflow" className="messages-overflow">
                    <InfiniteScroll
                        dataLength={items.length}
                        next={() => fetchMessages()}
                        hasMore={hasMore}
                        style={{ display: 'flex', flexDirection: 'column-reverse' }}
                        inverse={true}
                        loader={<p>Loading...</p>}
                        endMessage={<p></p>}
                        scrollableTarget="messages-overflow"
                    >  
                        <div style={{display: "flex", flexDirection: "column", marginBottom: "3.5rem"}}>
                            { 
                            selected? (
                            messages[selected.room_id]? (
                                messages[selected.room_id].map(e => {
                                    return <Message data={e} />
                                })
                                ) : ("")
                                ) : ("")
                            }
                        </div>
                     {
                            items.map(e => {
                                return <Message data={e} />
                            })
                        }
                    </InfiniteScroll>
                </div>
            </div>
        </>
    )
}

export default LoadMessages
