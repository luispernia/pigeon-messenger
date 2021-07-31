import { useAuth, ProvideAuth } from "../services/context/UserContext";
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




function Routes() {
    return (
        <>
            <Router>
                <Switch>

                    <Route exact path="/">
                        <Landing/>
                    </Route>

                    <Route path="/login">

                    </Route>

                    <Route path="/register">
                        <Register/>
                    </Route>

                    <Route path="/chat">
                        <Chat />    
                    </Route>


                    <PrivateRoute path="/protected">

                    </PrivateRoute>

                </Switch>
            </Router>
        </>
    )
}

function PrivateRoute({ children, ...rest }) {
    let { user }  = useAuth();

    return (
      <Route
        {...rest}
        render={({ location }) =>
          user.email ? (
            <>
              {children}
              {user.email}
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