import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from 'react-redux'
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './App'

import configureStore from "./store/index";
import theme from './theme';

const store = configureStore();

ReactDOM.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <App/>
      </Provider>
    </ThemeProvider>,
    document.getElementById("react")
);
