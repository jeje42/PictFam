import * as React from "react"
import * as ReactDOM from "react-dom"
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import store from './store'

import Hello from './components/Hello'

ReactDOM.render(
    <Provider store={store}>
      <div>
        <Hello compiler="Doudou" framework="Grosminet"></Hello>
      </div>
    </Provider>,
    document.getElementById("react")
);
