import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green'
import yellow from '@material-ui/core/colors/yellow';
import orange from '@material-ui/core/colors/orange';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A700,
    },
    background: {
      default: '#339933',
    },
    // @ts-ignore
    success: {
      main: green.A700,
    },
    // @ts-ignore
    info: {
      main: yellow.A400,
    },
    // @ts-ignore
    warning: {
      main: orange.A400,
    },
  },
});

export default theme;
