// https://reacttraining.com/react-router/web/example/auth-workflow
// https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in/SignIn.js

import React, { ChangeEvent, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';

import { LoginObject } from '../store/auth-profile/types';
import { startLogin } from '../store/auth-profile/actions';
import { connect } from 'react-redux';
import { AppState } from '../store';
import { useHistory } from 'react-router-dom';
import { Grow } from '@material-ui/core';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'No Copyright ©, allez vous faire mettre ! '}
      <Link color='inherit' href='https://material-ui.com/'>
        Avec material UI
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface LoginProps {
  startLogin: typeof startLogin;
  isAuthenticated: boolean;
  loginHasFailed: boolean;
}

const Login: React.FC<LoginProps> = props => {
  const classes = useStyles();
  const [loginObject, setLoginObject] = React.useState<LoginObject>({
    userNameOrEmail: '',
    password: '',
  });

  const history = useHistory();

  useEffect(() => {
    if (props.isAuthenticated) {
      history.replace('/');
    }
  }, [history, props.isAuthenticated]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.startLogin(loginObject);
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <form className={classes.form} noValidate autoComplete='off' onSubmit={handleSubmit}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='userNameOrEmail'
            label='User name'
            name='userNameOrEmail'
            autoComplete='email'
            autoFocus
            value={loginObject.userNameOrEmail}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setLoginObject({ ...loginObject, userNameOrEmail: event.target.value })}
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            value={loginObject.password}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setLoginObject({ ...loginObject, password: event.target.value })}
          />
          <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
            Sign In
          </Button>
          <Grow in={props.loginHasFailed}>
            <Alert severity='error'>Invalid credentials</Alert>
          </Grow>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loginHasFailed: state.auth.loginHasFailed,
});

export default connect(mapStateToProps, { startLogin })(Login);
