import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from 'react-redux'
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';


import configureStore from "./store/index";
import theme from './theme';

const store = configureStore();

import Hello from './containers/Welcome'

ReactDOM.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <div>
          <Hello compiler="Doudou" framework="Grosminet"></Hello>
        </div>
      </Provider>
    </ThemeProvider>,
    document.getElementById("react")
);
