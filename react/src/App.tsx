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
import { startPhotosFetched } from './store/photo/actions';
import { startFetchAlbumsImage, startFetchAlbumsVideo } from './store/album/actions';
import { startVideosFetched } from './store/video/actions';

interface AppProps {
  isAuthenticated: boolean;
  currentModule: Module;
  startPhotosFetched: typeof startPhotosFetched;
  startFetchAlbumsImage: typeof startFetchAlbumsImage;
  startFetchAlbumsVideo: typeof startFetchAlbumsVideo;
  startVideosFetched: typeof startVideosFetched;
}

const App: React.FC<AppProps> = props => {
  const { currentModule, startPhotosFetched, startFetchAlbumsImage, startFetchAlbumsVideo, startVideosFetched } = props;
  useEffect(() => {
    switch (currentModule) {
      case Module.Image:
        startPhotosFetched();
        startFetchAlbumsImage();
        break;
      case Module.Video:
        startFetchAlbumsVideo();
        startVideosFetched();
        break;
    }
  }, [currentModule, startFetchAlbumsImage, startFetchAlbumsVideo, startPhotosFetched, startVideosFetched]);

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
  currentModule: state.app.module,
});

export default connect(mapStateToProps, { startPhotosFetched, startFetchAlbumsImage, startFetchAlbumsVideo, startVideosFetched })(App);
