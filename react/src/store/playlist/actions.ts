import { InitStateAction, PLAYLIST_ACTION, PlaylistsFetchedAction, SelectPlaylistAction, SetPlaylist, StartPlaylistsFetchedAction } from './types';
import { Playlist } from '../../types/Playlist';

export function startPlaylistsFetch(): StartPlaylistsFetchedAction {
  return {
    type: PLAYLIST_ACTION.START_PLAYLIST_FETCHED,
    request: {
      method: 'get',
      url: '/playlist',
    },
  };
}

export function playlistsFetched(playlists: Playlist[]): PlaylistsFetchedAction {
  return {
    type: PLAYLIST_ACTION.PLAYLIST_FETCHED,
    playlists,
  };
}

export function setPlaylist(playlist: Playlist): SetPlaylist {
  return {
    type: PLAYLIST_ACTION.SET_PLAYLIST,
    playlist,
  };
}

export function selectPlaylist(playlist?: Playlist): SelectPlaylistAction {
  return {
    type: PLAYLIST_ACTION.PLAYLIST_SELECTED,
    playlist,
  };
}

export function initPlaylistState(): InitStateAction {
  return {
    type: PLAYLIST_ACTION.INIT_PLAYLIST_STATE,
  };
}
