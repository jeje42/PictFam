import React, { useEffect } from 'react';
import { register as socketRegister } from '../utils/socketUtils';
import { connect } from 'react-redux';
import { AppState } from '../store';
import { removePlaylist, startFetchOnePlaylist } from '../store/playlist/actions';

const TOPIC = '/topic';

interface SocketHocProps {
  isAuthenticated: boolean;
  token: string;
  startFetchOnePlaylist: typeof startFetchOnePlaylist;
  removePlaylist: typeof removePlaylist;
}

const SocketHocFC: React.FC<SocketHocProps> = ({ isAuthenticated, token, startFetchOnePlaylist }) => {
  useEffect(() => {
    if (isAuthenticated) {
      const newOrUpdatePlaylistCB = (entityLink: string) => startFetchOnePlaylist(entityLink);
      const removePlaylistCB = (entityLink: string) => removePlaylist(entityLink.split('/').pop()!);

      socketRegister(
        [
          { route: `${TOPIC}/newPlaylist`, callback: (message: { body: string }) => newOrUpdatePlaylistCB(message.body) },
          { route: `${TOPIC}/removePlaylist`, callback: (message: { body: string }) => removePlaylistCB(message.body) },
        ],
        token,
      );
    }
  }, [token, isAuthenticated, startFetchOnePlaylist]);

  return <></>;
};

const mapStateToProps = (state: AppState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  token: state.auth.token,
});

export default connect(mapStateToProps, { startFetchOnePlaylist, removePlaylist })(SocketHocFC);
