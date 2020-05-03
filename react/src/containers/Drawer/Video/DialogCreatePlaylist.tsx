import React, { useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, TextField } from '@material-ui/core';
import { Form, Field } from 'react-final-form';
import { ValidationErrors } from 'final-form';
import TextInput from '../../../components/final-forms/TextInput';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { AppState } from '../../../store';
import { connect } from 'react-redux';
import { ErrorAxios } from '../../Video/playlistRequestHandling';
import { setPlaylist } from '../../../store/playlist/actions';
import { Playlist } from '../../../types/Playlist';

interface DialogCreateAlbumProps {
  token: string;
  handleClose: () => void;
  setPlaylist: typeof setPlaylist;
}

interface Values {
  name?: string;
}

interface PutResponse {
  data: Playlist;
}

type returnValidate = ValidationErrors | Promise<ValidationErrors> | undefined;
const validate = (values: Values): returnValidate => {
  const errors: any = {};
  if (!values.name) {
    errors.name = 'Required';
  }
  return errors;
};

const DialogCreateAlbumFC: React.FC<DialogCreateAlbumProps> = props => {
  const putRequestOption: AxiosRequestConfig = {
    method: 'put',
    url: `/playlist`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${props.token}`,
    },
  };

  const onSubmit = async (values: Values) => {
    let errorMessage: string | undefined;

    const response: any = await axios.put(putRequestOption.url!, values, putRequestOption).catch((error: ErrorAxios) => {
      errorMessage = error.response.data.message;
      if (!errorMessage) {
        errorMessage = 'Une erreur est survenue';
      }
    });

    if (errorMessage) {
      window.alert(errorMessage);
    } else {
      props.setPlaylist({
        ...response.data,
        videos: [],
      });
      props.handleClose();
    }
  };

  return (
    <Dialog open={true} onClose={props.handleClose} disableBackdropClick>
      <DialogTitle id='form-dialog-title'>Créer une playlist</DialogTitle>
      <DialogContent>
        <Form
          onSubmit={onSubmit}
          initialValues={{ name: '' }}
          validate={validate}
          render={({ handleSubmit, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit} noValidate>
              <Grid container alignItems='flex-start' spacing={2}>
                <Grid item xs={12}>
                  <Field<string> label='Nom' name='name' margin='none' required={true} component={TextInput} />
                </Grid>
              </Grid>
              <Grid container alignItems='flex-end' spacing={2}>
                <Grid item style={{ marginTop: 16 }}>
                  <Button type='button' variant='contained' onClick={props.handleClose} style={{ margin: 10 }}>
                    Annuler
                  </Button>
                  <Button variant='contained' color='primary' type='submit' disabled={submitting} style={{ margin: 10 }}>
                    Enregistrer
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        />
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (state: AppState) => ({
  token: state.auth.token,
});

export default connect(mapStateToProps, { setPlaylist })(DialogCreateAlbumFC);
