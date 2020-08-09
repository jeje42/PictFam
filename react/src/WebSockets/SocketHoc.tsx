import React, { useEffect } from 'react';
import { register as socketRegister } from '../utils/socketUtils';
import { connect } from 'react-redux';
import { AppState } from '../store';
import { removePlaylist, startFetchOnePlaylist } from '../store/playlist/actions';
import { newAlbumFromSocketSagaAction } from '../store/album';
import { newOrUpdatePhotoFromSocketSagaAction } from '../store/photo/actions';
import { newOrUpdateVideoFromSocketSagaAction } from '../store/video/actions';

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

enum WsPhoto {
  New = 'newPhoto',
  Update = 'updatePhoto',
  Remove = 'removePhoto',
}

enum WsVideo {
  New = 'newVideo',
  Update = 'updateVideo',
  Remove = 'removeVideo',
}

interface SocketHocProps {
  token: string;
  startFetchOnePlaylist: typeof startFetchOnePlaylist;
  removePlaylist: typeof removePlaylist;
  newAlbumFromSocketSagaAction: typeof newAlbumFromSocketSagaAction;
  newOrUpdatePhotoFromSocketSagaAction: typeof newOrUpdatePhotoFromSocketSagaAction;
  newOrUpdateVideoFromSocketSagaAction: typeof newOrUpdateVideoFromSocketSagaAction;
}

const SocketHocFC: React.FC<SocketHocProps> = ({
  token,
  startFetchOnePlaylist,
  removePlaylist,
  newAlbumFromSocketSagaAction,
  newOrUpdatePhotoFromSocketSagaAction,
  newOrUpdateVideoFromSocketSagaAction,
}) => {
  useEffect(() => {
    if (token && token !== '') {
      const newOrUpdatePlaylistCB = (entityLink: string) => startFetchOnePlaylist(entityLink);

      const removePlaylistCB = (entityLink: string) => removePlaylist(entityLink.split('/').pop()!);

      const newOrUpdateAlbumCB = (entityLink: string) => newAlbumFromSocketSagaAction(entityLink);

      const newOrUpdatePhotoCB = (entityLink: string) => newOrUpdatePhotoFromSocketSagaAction(entityLink);

      const newOrUpdateVideoCB = (entityLink: string) => newOrUpdateVideoFromSocketSagaAction(entityLink);

      // const removeAlbumCB = (entityLink: string) => removePlaylist(entityLink.split('/').pop()!);

      socketRegister(
        [
          { route: `${TOPIC}/${WsPlaylist.New}`, callback: (message: { body: string }) => newOrUpdatePlaylistCB(message.body) },
          { route: `${TOPIC}/${WsPlaylist.Update}`, callback: (message: { body: string }) => newOrUpdatePlaylistCB(message.body) },
          { route: `${TOPIC}/${WsPlaylist.Remove}`, callback: (message: { body: string }) => removePlaylistCB(message.body) },

          { route: `${TOPIC}/${WsAlbum.New}`, callback: (message: { body: string }) => newOrUpdateAlbumCB(message.body) },
          { route: `${TOPIC}/${WsAlbum.Update}`, callback: (message: { body: string }) => newOrUpdateAlbumCB(message.body) },
          // { route: `${TOPIC}/${WsAlbum.Remove}`, callback: (message: { body: string }) => removePlaylistCB(message.body) },

          { route: `${TOPIC}/${WsPhoto.New}`, callback: (message: { body: string }) => newOrUpdatePhotoCB(message.body) },
          { route: `${TOPIC}/${WsPhoto.Update}`, callback: (message: { body: string }) => newOrUpdatePhotoCB(message.body) },
          // { route: `${TOPIC}/${WsPhoto.Remove}`, callback: (message: { body: string }) => removePlaylistCB(message.body) },

          { route: `${TOPIC}/${WsVideo.New}`, callback: (message: { body: string }) => newOrUpdateVideoCB(message.body) },
          { route: `${TOPIC}/${WsVideo.Update}`, callback: (message: { body: string }) => newOrUpdateVideoCB(message.body) },
          // { route: `${TOPIC}/${WsVideo.Remove}`, callback: (message: { body: string }) => removePlaylistCB(message.body) },
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

export default connect(mapStateToProps, {
  startFetchOnePlaylist,
  removePlaylist,
  newAlbumFromSocketSagaAction,
  newOrUpdatePhotoFromSocketSagaAction,
  newOrUpdateVideoFromSocketSagaAction,
})(SocketHocFC);
