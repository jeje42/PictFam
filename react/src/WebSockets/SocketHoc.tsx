import React, { useEffect } from 'react';
import { register as socketRegister } from '../utils/socketUtils';
import { connect } from 'react-redux';
import { AppState } from '../store';
import { startFetchOnePlaylist } from '../store/playlist/actions';

interface SocketHocProps {
  isAuthenticated: boolean;
  token: string;
  startFetchOnePlaylist: typeof startFetchOnePlaylist;
}

const SocketHocFC: React.FC<SocketHocProps> = ({ isAuthenticated, token, startFetchOnePlaylist }) => {
  useEffect(() => {
    if (isAuthenticated) {
      const newOrUpdatePlaylist = (entityLink: string) => startFetchOnePlaylist(entityLink);

      socketRegister(
        [
          {
            route: '/topic/newPlaylist',
            callback: (message: { body: string }) => newOrUpdatePlaylist(message.body),
          },
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

export default connect(mapStateToProps, { startFetchOnePlaylist })(SocketHocFC);
