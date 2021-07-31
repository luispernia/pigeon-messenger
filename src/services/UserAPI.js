import React, { useEffect, useReducer, useState } from 'react'
import { ProvideAuth, useAuth } from "./context/UserContext";
import Chat from '../components/Chat';

function UserAPI() {

  return (
    <>
      <TextUser />
      <Chat />
    </>
  )
}

function TextUser() {

  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  

  return (
    <>
      {/* <h1>User: {auth.user.email? auth.user.email : ""}</h1> */}
      <button onClick={() => {
        auth.signIn("perniaj54@gmail.com", "123");
        console.log(auth);
      }}>{auth.user.email}</button>
    </>
  )

}


export default UserAPI;