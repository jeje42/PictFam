import Hello from './containers/Welcome';
import * as React from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AppState } from './store';
import { connect } from 'react-redux';
import Login from './containers/Login';
import { ROUTE_IMAGES, ROUTE_VIDEOS } from './utils/routesUtils';
import ImagesPage from './containers/Photo/ImagesPage';
import VideoPage from './containers/Video/VideoPage';

interface AppProps {
  isAuthenticated: boolean;
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
                pathname: '/login',
                state: { from: location },
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
        <Route path='/login'>
          <Login />
        </Route>
        <PrivateRoute path={ROUTE_IMAGES}>
          <ImagesPage />
        </PrivateRoute>
        <PrivateRoute path={ROUTE_VIDEOS}>
          <VideoPage />
        </PrivateRoute>
        <PrivateRoute path='/'>
          <Redirect
            to={{
              pathname: ROUTE_IMAGES,
            }}
          />
        </PrivateRoute>
      </Switch>
    </Router>
  );
};

const mapStateToProps = (state: AppState) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {})(App);
