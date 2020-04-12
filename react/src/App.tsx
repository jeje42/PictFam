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
import { Album } from './types/Album';

interface AppProps {
  isAuthenticated: boolean;
  currentModule: Module;
  albumsImage: Album[];
  albumsVideo: Album[];
  startPhotosFetched: typeof startPhotosFetched;
  startFetchAlbumsImage: typeof startFetchAlbumsImage;
  startFetchAlbumsVideo: typeof startFetchAlbumsVideo;
  startVideosFetched: typeof startVideosFetched;
}

const App: React.FC<AppProps> = props => {
  const {
    currentModule,
    albumsImage,
    albumsVideo,
    isAuthenticated,
    startPhotosFetched,
    startFetchAlbumsImage,
    startFetchAlbumsVideo,
    startVideosFetched,
  } = props;
  useEffect(() => {
    if (isAuthenticated) {
      switch (currentModule) {
        case Module.Image:
          if (albumsImage.length == 0) {
            startPhotosFetched();
            startFetchAlbumsImage();
          }
          break;
        case Module.Video:
          if (albumsVideo.length == 0) {
            startFetchAlbumsVideo();
            startVideosFetched();
          }
          break;
      }
    }
  }, [
    albumsImage.length,
    albumsVideo.length,
    currentModule,
    isAuthenticated,
    startFetchAlbumsImage,
    startFetchAlbumsVideo,
    startPhotosFetched,
    startVideosFetched,
  ]);

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
  albumsImage: state.albums.albumsImage,
  albumsVideo: state.albums.albumsVideo,
});

export default connect(mapStateToProps, { startPhotosFetched, startFetchAlbumsImage, startFetchAlbumsVideo, startVideosFetched })(App);
