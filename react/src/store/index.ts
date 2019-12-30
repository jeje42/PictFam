import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import  { photosReducer } from "./photo/reducers";
import  { albumsReducer } from "./album/reducers";
import  { drawerReducer } from "./drawer/reducers";

const rootReducer = combineReducers({
  photos: photosReducer,
  albums: albumsReducer,
  drawer: drawerReducer
})

export type AppState = ReturnType<typeof rootReducer>

export default function configureStore() {
  const middlewares = [thunkMiddleware]
  const middleWareEnhancer = applyMiddleware(...middlewares)

  const store = createStore(
    rootReducer,
    composeWithDevTools(middleWareEnhancer)
  )

  return store
}
