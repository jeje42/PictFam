import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from 'react-redux'
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withSize } from 'react-sizeme'

import configureStore from "./store/index";
import theme from './theme';

const store = configureStore();

import Hello from './containers/Welcome'

interface AppProps {
  size: any
}

const App = (props: AppProps) => {
  console.log("AppProps")
  console.log(props.size)

  return (
    <Hello compiler="Doudou" framework="Grosminet"></Hello>
  )
}

const AppSize = withSize({ monitorHeight: true })(App)

ReactDOM.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <AppSize/>
      </Provider>
    </ThemeProvider>,
    document.getElementById("react")
);
