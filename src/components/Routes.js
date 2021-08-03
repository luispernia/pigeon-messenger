import { useContext, useEffect } from "react";
import { ProvideAuth } from "../services/context/UserState";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import Register from "./Register";
import Landing from "./Landing";
import Chat from "./Chat";
import Success from "./Success";
import Login from "./Login";
import userContext from "../services/context/UserContext";


function Routes() {

  const {user} = useContext(userContext);

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
            <Login/>
          </Route>

          <Route path="/register">
            <Register />
          </Route>

          <PrivateRoute path="/chat">
            <Chat />
          </PrivateRoute>

        </Switch>
      </Router>
    </>
  )
}

function PrivateRoute({ children, ...rest }) {
  let { user } = useContext(userContext);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          <>
            {children}
          </>

        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default Routes;