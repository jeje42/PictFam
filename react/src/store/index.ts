import { createStore, combineReducers, applyMiddleware, Middleware, MiddlewareAPI, Dispatch, Action } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import { photosReducer } from './photo/reducers';
import { videosReducer } from './video/reducers';
import { albumsReducer, watchFetchAlbumsFromRoot, watchNewAlbumFromSocketSagaAction } from './album';
import { drawerReducer } from './drawer/reducers';
import { authReducer } from './auth-profile/reducers';
import { appReducer } from './app/reducers';
import { playlistsReducer } from './playlist/reducers';

import { watchLogout, watchStartScan, watchTryLogin, watchFetchAll } from './auth-profile/sagas';
import { watchNewOrUpdatePhoto, watchTryFetchPhotos } from './photo/sagas';
import { watchNewOrUpdateVideo, watchTryFetchVideos } from './video/sagas';
import { ActionRequest } from './types';
import { watchTryFetchAllPlaylists, watchTryFetchOnePlaylists } from './playlist/sagas';
import { feedbackReducer } from './feedback';

const rootReducer = combineReducers({
  photos: photosReducer,
  videos: videosReducer,
  albums: albumsReducer,
  playlists: playlistsReducer,
  drawer: drawerReducer,
  auth: authReducer,
  app: appReducer,
  feedback: feedbackReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

const saga = createSagaMiddleware();

const requestsMiddleware: Middleware<AppState> = (store: MiddlewareAPI<Dispatch, AppState>) => (next: Dispatch<Action>) => (action: ActionRequest) => {
  if (action.request) {
    action.request = {
      ...action.request,
      headers: {
        ...action.request.headers,
        Authorization: `Bearer ${store.getState().auth.token}`,
      },
    };
  }
  const result = next(action);
  return result;
};

export default function configureStore() {
  const middlewares = [thunkMiddleware, requestsMiddleware];
  const middleWareEnhancer = applyMiddleware(...middlewares, saga);

  const store = createStore(rootReducer, composeWithDevTools(middleWareEnhancer));

  saga.run(watchTryLogin);
  saga.run(watchTryFetchPhotos);
  saga.run(watchTryFetchVideos);
  saga.run(watchFetchAlbumsFromRoot);
  saga.run(watchNewAlbumFromSocketSagaAction);
  saga.run(watchLogout);
  saga.run(watchStartScan);
  saga.run(watchFetchAll);
  saga.run(watchTryFetchAllPlaylists);
  saga.run(watchTryFetchOnePlaylists);
  saga.run(watchNewOrUpdatePhoto);
  saga.run(watchNewOrUpdateVideo);

  return store;
}
