import React, {useReducer,useContext, useEffect, useState} from 'react'
import MessagesReducer from './MessagesReducer';
import messagesContext from './MessagesContext';
import roomsContext from './RoomContext';

function ProviderMessages({children}) {

    const initialState = {
        messages: []
    }

    const { selected } = useContext(roomsContext);

    const [state, dispatch] = useReducer(MessagesReducer, initialState);

    const clear_queue = () => {
        dispatch({type: "DELETE_UPLOAD", payload: []});
    }

    const setMessageUpload = (message) => {
        console.log(selected);
        dispatch({type: "MESSAGE_UPLOAD", payload: message});
    }   

    return (
        <messagesContext.Provider value={{
            setMessageUpload,
            clear_queue,
            messages: state.messages
        }
        } >{children}</messagesContext.Provider>
    )
}

export default ProviderMessages
