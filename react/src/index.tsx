import * as React from "react"
import * as ReactDOM from "react-dom"
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import configureStore from "./store/index";

const store = configureStore();

import Hello from './components/Hello'

ReactDOM.render(
    <Provider store={store}>
      <div>
        <Hello compiler="Doudou" framework="Grosminet"></Hello>
      </div>
    </Provider>,
    document.getElementById("react")
);
