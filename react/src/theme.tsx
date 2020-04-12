import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';
import orange from '@material-ui/core/colors/orange';
import { createMuiTheme } from '@material-ui/core/styles';
import { lime, teal } from '@material-ui/core/colors';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: lime['500'],
      light: lime['300'],
    },
    secondary: {
      main: orange['500'],
    },
    error: {
      main: red.A700,
    },
    background: {
      default: teal['400'],
      paper: teal['400'],
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
