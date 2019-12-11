import { createStore, applyMiddleware } from 'redux'
import { createBrowserHistory } from 'history';
import { routerMiddleware as createRouterMiddleware } from 'connected-react-router';
import rootReducer from './root-reducer';
import { composeEnhancers } from './utils';


// browser history
export const history = createBrowserHistory();

const routerMiddleware = createRouterMiddleware(history);

// configure middlewares
const middlewares = [routerMiddleware];
// compose enhancers
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

// rehydrate state on app start
const initialState = {};

// create store
const store = createStore(rootReducer(history), initialState, enhancer);

export default store;
