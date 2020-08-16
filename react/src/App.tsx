import * as React from 'react';
import { useEffect } from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { AppState } from './store';
import { connect } from 'react-redux';
import Login from './containers/Login';
import { ROUTE_IMAGES, ROUTE_VIDEOS } from './utils/routesUtils';
import ImagesPage from './containers/Photo/ImagesPage';
import VideoPage from './containers/Video/VideoPage';
import { Module } from './store/app/types';
import { fetchAllAction } from './store/auth-profile/actions';
import { SocketHoc } from './WebSockets';
import { MyConnectedSnackbar } from './containers/Feedback';

interface AppProps {
  isAuthenticated: boolean;
  currentModule: Module;
  fetchAllAction: typeof fetchAllAction;
}

const App: React.FC<AppProps> = ({ currentModule, fetchAllAction, isAuthenticated }) => {
  useEffect(() => {
    fetchAllAction();
  }, [currentModule, isAuthenticated, fetchAllAction]);

  function PrivateRoute({ children, path, ...rest }: { children: React.ReactNode; path: string }) {
    return (
      <Route
        path={path}
        {...rest}
        render={({ location }) =>
          isAuthenticated ? (
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
    <>
      <SocketHoc />
      <MyConnectedSnackbar />
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
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  currentModule: state.app.module,
  token: state.auth.token,
});

export default connect(mapStateToProps, { fetchAllAction })(App);
