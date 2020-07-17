import { PLAYLIST_ACTION, PlaylistActionTypes, PlaylistsState } from './types';
import { Playlist } from '../../types/Playlist';

const initialState: PlaylistsState = {
  playlists: [],
};

const playlistSelected = (state: PlaylistsState, newPlaylistSelected?: Playlist) => {
  return {
    ...state,
    playlists: state.playlists.map(playlist => {
      if (!newPlaylistSelected) {
        playlist.selected = false;
      } else {
        if (playlist.selected && newPlaylistSelected.id !== playlist.id) {
          playlist.selected = false;
        }

        if (newPlaylistSelected.id === playlist.id) {
          playlist.selected = true;
        }
      }

      return playlist;
    }),
  };
};

const setPlaylist = (state: PlaylistsState, playlist: Playlist): PlaylistsState => {
  if (!state.playlists.find(playlistInState => playlistInState.id === playlist.id)) {
    const newPlaylists = state.playlists.map(a => a);
    newPlaylists.push(playlist);

    return {
      ...state,
      playlists: newPlaylists,
    };
  }

  return {
    ...state,
    playlists: state.playlists.map(playlistState => (playlistState.id === playlist.id ? playlist : playlistState)),
  };
};

const playListsFetched = (state: PlaylistsState, playlists: Playlist[]): PlaylistsState => {
  const newPlaylists = playlists.filter(pl => !state.playlists.find(playlistInReducer => playlistInReducer.id === pl.id));

  const playlistsFromReducerUpdated = state.playlists.map(playlistInReducer => {
    const foundNewPlaylist = playlists.find(pl => pl.id === playlistInReducer.id);
    return foundNewPlaylist ? foundNewPlaylist : playlistInReducer;
  });

  return {
    ...state,
    playlists: [...playlistsFromReducerUpdated, ...newPlaylists],
  };
};

const removePlaylist = (state: PlaylistsState, playlistId: string): PlaylistsState => ({
  ...state,
  playlists: state.playlists.filter(pl => pl.id !== Number(playlistId)),
});

export function playlistsReducer(state = initialState, action: PlaylistActionTypes): PlaylistsState {
  switch (action.type) {
    case PLAYLIST_ACTION.PLAYLIST_FETCHED:
      return playListsFetched(state, action.playlists);
    case PLAYLIST_ACTION.PLAYLIST_SELECTED:
      return playlistSelected(state, action.playlist);
    case PLAYLIST_ACTION.SET_PLAYLIST:
      return setPlaylist(state, action.playlist);
    case PLAYLIST_ACTION.REMOVE_PLAYLIST:
      return removePlaylist(state, action.playlistId);
    case PLAYLIST_ACTION.INIT_PLAYLIST_STATE:
      return initialState;
    default:
      return state;
  }
}
