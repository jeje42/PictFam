import React, { useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import { shiftMessageAction } from '../../store/feedback';
import { FeedbackMessage } from '../../store/feedback';

interface SnackbarProps {
  messages: FeedbackMessage[];
  shiftMessageAction: typeof shiftMessageAction;
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SnackbarFC: React.FC<SnackbarProps> = ({ messages, shiftMessageAction }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    shiftMessageAction();
  };

  useEffect(() => {
    if (messages.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [messages]);

  if (!open || !messages[0]) {
    return <></>;
  }

  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={messages[0].severity}>
          {messages[0].message}
        </Alert>
      </Snackbar>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  messages: state.feedback.messages,
});

export default connect(mapStateToProps, { shiftMessageAction })(SnackbarFC);
