import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from 'redux-saga';

import { photosReducer } from "./photo/reducers";
import { albumsReducer } from "./album/reducers";
import { drawerReducer } from "./drawer/reducers";
import { authReducer } from "./auth-profile/reducers"

import { watchTryLogin } from './auth-profile/sagas'

const rootReducer = combineReducers({
  photos: photosReducer,
  albums: albumsReducer,
  drawer: drawerReducer,
  auth: authReducer
})

const saga = createSagaMiddleware();

export type AppState = ReturnType<typeof rootReducer>

export default function configureStore() {
  const middlewares = [thunkMiddleware]
  const middleWareEnhancer = applyMiddleware(...middlewares, saga)

  const store = createStore(
    rootReducer,
    composeWithDevTools(middleWareEnhancer)
  )

  saga.run(watchTryLogin)

  return store
}
