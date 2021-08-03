import React, { useContext } from 'react'
import userContext from '../services/context/UserContext'

function Child() {
    const { user } = useContext(userContext);

    return (
        <div>
            {user? (<h1>{user.name}</h1>) : (<h1>No User</h1>)}
        </div>
    )
}

export default Child
