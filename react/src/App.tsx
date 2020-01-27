import Hello from "./containers/Welcome";
import * as React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation
} from "react-router-dom";
import {AppState} from "./store";
import {connect} from "react-redux";
import Login from './containers/Login'
import {useEffect} from "react";

interface AppProps {
    isAuthenticated: boolean
}

const App: React.FC<AppProps> = props => {

    // @ts-ignore
    function PrivateRoute({ children, ...rest }) {
        return (
            <Route
                {...rest}
                render={({ location }) =>
                    props.isAuthenticated ? (
                        children
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

    return (
        <Router>
            <Switch>
                <Route path="/login">
                    <Login />
                </Route>
                <PrivateRoute path="/">
                    <Hello />
                </PrivateRoute>
            </Switch>
        </Router>
    )
}

const mapStateToProps = (state: AppState) => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {})(App)