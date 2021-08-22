/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
import Register from "../pages/Register";
import Landing from "../pages/Landing";
import Chat from "../pages/Chat";
import Success from "./Success";
import Login from "../pages/Login";
import userContext from "../services/context/UserContext";
import ProvideBell from "../services/context/BellState";
import axios from "axios";
import ProviderRoom from "../services/context/RoomState";
import ProviderMessages from "../services/context/MessagesState";
import Loading from "./Loading";
import PostRegister from "./PostRegister";


function Routes() {

  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>

          <PreRoute path="/finish">
            <PostRegister />
          </PreRoute>

          <PrivateRoute path="/success">
            <Success />
          </PrivateRoute>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/register">
            <Register />
          </Route>

          <PrivateRoutePlus path="/chat">
            <ProviderRoom>
              <ProviderMessages>
                <ProvideBell>
                  <Chat />
                </ProvideBell>
              </ProviderMessages>
            </ProviderRoom>
          </PrivateRoutePlus>
        </Switch>
      </Router>
    </>
  )
}

function PrivateRoutePlus({ children, ...rest }) {
  let { updateUser } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    axios.post("http://localhost:8080/refresh_token", {}, { withCredentials: true })
      .then(res => {
        console.log(res);
        if (res.data.ok) {
          if(res.data.user.username === res.data.user.email) {
              updateUser(res.data, (user) => {
                history.replace("/finish")
                setLoading(true);
              })
          } else {
            updateUser(res.data, (user) => {
              history.replace("/chat");
              setLoading(true);
            })
          }
        } else {
          history.replace("/login");
          setLoading(true);
        }
      })
      .catch(err => {
        console.log(err);
      })

  }, [])

  return (<>
    {loading ? (<Route
      {...rest}
      render={({ location }) =>
        loading ? (
          <>
            {children}
          </>

        ) : (
          <>
            <Loading />
          </>
        )
      }
    />) : (<>
      <Loading />
    </>)}
  </>
  );
}


function PrivateRoute({ children, ...rest }) {
  let { user } = useContext(userContext);

  return (<>
    <Route
      {...rest}
      render={({ location }) =>
        user ? (user.username !== user.email? (

          <>
            {children}
          </>

        ) : (<Redirect to={{ pathname: "/finish", state: { from: location } }} />)) : (
          <Redirect to={{ pathname: "/register", state: { from: location } }} />
        )
      }
    />
  </>
  );
}

function PreRoute({children, ...rest}) {
  const {user} = useContext(userContext);

  return (
    <Route
      {...rest}
      render={({location}) => {
        return (
          user? 
          (user.username !== user.email? (<Redirect to={{pathname: "/chat"}} />) : 
          children) : <Redirect to={{pathname: "/login"}} />
        )
      }}
    />
  )

    
}

export default Routes;