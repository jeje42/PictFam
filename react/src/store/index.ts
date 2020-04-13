import { createStore, combineReducers, applyMiddleware, Middleware, MiddlewareAPI, Dispatch, Action } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import { photosReducer } from './photo/reducers';
import { videosReducer } from './video/reducers';
import { albumsReducer } from './album/reducers';
import { drawerReducer } from './drawer/reducers';
import { authReducer } from './auth-profile/reducers';
import { appReducer } from './app/reducers';

import { watchLogout, watchStartScan, watchTryLogin, watchFetchAll } from './auth-profile/sagas';
import { watchTryFetchPhotos } from './photo/sagas';
import { watchTryFetchAlbumsImage, watchTryFetchAlbumsVideo } from './album/sagas';
import { watchTryFetchVideos } from './video/sagas';
import { ActionRequest } from './types';

const rootReducer = combineReducers({
  photos: photosReducer,
  videos: videosReducer,
  albums: albumsReducer,
  drawer: drawerReducer,
  auth: authReducer,
  app: appReducer,
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
  saga.run(watchTryFetchAlbumsImage);
  saga.run(watchTryFetchAlbumsVideo);
  saga.run(watchLogout);
  saga.run(watchStartScan);
  saga.run(watchFetchAll);

  return store;
}
