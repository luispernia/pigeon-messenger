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


function Routes() {

  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>

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
        if (res.data.ok) {
          updateUser(res.data, (user) => {
            history.replace("/chat");
            setLoading(true);
          })
        } else {
          history.replace("/login");
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
            <h1>Loading</h1>
          </>
        )
      }
    />) : (<>
      <h1>LOADING</h1>
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
        user ? (
          <>
            {children}
          </>

        ) : (
          <Redirect to={{ pathname: "/", state: { from: location } }} />
        )
      }
    />
  </>
  );
}

export default Routes;