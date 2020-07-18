import React, { useEffect } from 'react';
import { register as socketRegister } from '../utils/socketUtils';
import { connect } from 'react-redux';
import { AppState } from '../store';
import { removePlaylist, startFetchOnePlaylist } from '../store/playlist/actions';

const TOPIC = '/topic';

enum WsPlaylist {
  New = 'newPlaylist',
  Update = 'updatePlaylist',
  Remove = 'removePlaylist',
}

enum WsAlbum {
  New = 'newAlbum',
  Update = 'updateAlbum',
  Remove = 'removeAlbum',
}

interface SocketHocProps {
  token: string;
  startFetchOnePlaylist: typeof startFetchOnePlaylist;
  removePlaylist: typeof removePlaylist;
}

const SocketHocFC: React.FC<SocketHocProps> = ({ token, startFetchOnePlaylist, removePlaylist }) => {
  useEffect(() => {
    if (token && token !== '') {
      const newOrUpdatePlaylistCB = (entityLink: string) => startFetchOnePlaylist(entityLink);
      const removePlaylistCB = (entityLink: string) => removePlaylist(entityLink.split('/').pop()!);

      const newOrUpdateAlbumCB = (entityLink: string) => startFetchOnePlaylist(entityLink);
      // const removeAlbumCB = (entityLink: string) => removePlaylist(entityLink.split('/').pop()!);

      socketRegister(
        [
          { route: `${TOPIC}/${WsPlaylist.New}`, callback: (message: { body: string }) => newOrUpdatePlaylistCB(message.body) },
          { route: `${TOPIC}/${WsPlaylist.Update}`, callback: (message: { body: string }) => newOrUpdatePlaylistCB(message.body) },
          { route: `${TOPIC}/${WsPlaylist.Remove}`, callback: (message: { body: string }) => removePlaylistCB(message.body) },

          { route: `${TOPIC}/${WsAlbum.New}`, callback: (message: { body: string }) => newOrUpdateAlbumCB(message.body) },
          { route: `${TOPIC}/${WsAlbum.Update}`, callback: (message: { body: string }) => newOrUpdateAlbumCB(message.body) },
          // { route: `${TOPIC}/${WsAlbum.Remove}`, callback: (message: { body: string }) => removePlaylistCB(message.body) },
        ],
        token,
      );
    }
  }, [token, startFetchOnePlaylist, removePlaylist]);

  return <></>;
};

const mapStateToProps = (state: AppState) => ({
  token: state.auth.token,
});

export default connect(mapStateToProps, { startFetchOnePlaylist, removePlaylist })(SocketHocFC);
