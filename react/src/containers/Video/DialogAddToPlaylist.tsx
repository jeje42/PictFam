import { connect } from 'react-redux';
import React, { useState } from 'react';
import { AppState } from '../../store';
import { Button, Dialog, DialogActions, DialogContent, List, ListItem, ListItemIcon, ListItemText, Tooltip } from '@material-ui/core';
import { Playlist } from '../../types/Playlist';
import { Video } from '../../types/Video';
import axios, { AxiosRequestConfig } from 'axios';
import { ErrorAxios } from './playlistRequestHandling';
import { setPlaylist } from '../../store/playlist/actions';
import { transformPlaylistToPlaylistForBackend } from '../../store/playlist/utils';

interface DialogAddToPlaylistProps {
  token: string;
  playlists: Playlist[];
  videos: Video[];
  handleClose: () => void;
  setPlaylist: typeof setPlaylist;
}

const DialogAddToPlaylistFC: React.FC<DialogAddToPlaylistProps> = props => {
  const [playlistSelected, setPlaylistSelected] = useState<Playlist | undefined>();

  const postRequestOption: AxiosRequestConfig = {
    method: 'post',
    url: `/playlist`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${props.token}`,
    },
  };

  const onSubmit = async () => {
    let errorMessage: string | undefined;

    const newPlaylistObject: Playlist = {
      ...(playlistSelected as Playlist),
      videos: playlistSelected!.videos.concat(props.videos),
    };

    const response: any = await axios
      .post(postRequestOption.url!, transformPlaylistToPlaylistForBackend(newPlaylistObject), postRequestOption)
      .catch((error: ErrorAxios) => {
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
      });
      props.handleClose();
    }
  };

  return (
    <Dialog open={true} onClose={props.handleClose} disableBackdropClick fullWidth>
      <DialogContent>
        <List>
          {props.playlists.map((playlist: Playlist) => {
            return (
              <ListItem key={playlist.id} button={true} onClick={() => setPlaylistSelected(playlist)}>
                <ListItemText primary={playlist.name} />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color='primary'>
          Annuler
        </Button>
        <Button onClick={onSubmit} color='primary' autoFocus disabled={!playlistSelected}>
          Valider
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state: AppState) => ({
  token: state.auth.token,
  playlists: state.playlists.playlists,
});

export default connect(mapStateToProps, { setPlaylist })(DialogAddToPlaylistFC);
