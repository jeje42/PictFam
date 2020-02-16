import { combineReducers } from 'redux';
import { History } from 'history';

import { connectRouter } from 'connected-react-router';
import { photosReducer } from './photo/reducers'
import { videosReducer } from './video/reducers'


const rootReducer = (history: History) => combineReducers({
  router: connectRouter(history),
  photos: photosReducer,
  videos: videosReducer
})

export default rootReducer;
