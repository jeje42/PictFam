import {
  InitStateAction,
  PLAYLIST_ACTION,
  PlaylistsFetchedAction,
  RemovePlaylist,
  SelectPlaylistAction,
  SetPlaylist,
  StartFetchAllPlaylistsAction,
  StartFetchOnePlaylistsAction,
} from './types';
import { Playlist } from '../../types/Playlist';

export function startFetchAllPlaylists(): StartFetchAllPlaylistsAction {
  return {
    type: PLAYLIST_ACTION.START_FETCH_ALL_PLAYLIST,
    request: {
      method: 'get',
      url: '/playlist',
    },
  };
}

export function startFetchOnePlaylist(url: string): StartFetchOnePlaylistsAction {
  return {
    type: PLAYLIST_ACTION.START_FETCH_ONE_PLAYLIST,
    request: {
      method: 'get',
      url,
    },
  };
}

export function playlistsFetch(playlists: Playlist[]): PlaylistsFetchedAction {
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

export function removePlaylist(playlistId: string): RemovePlaylist {
  return {
    type: PLAYLIST_ACTION.REMOVE_PLAYLIST,
    playlistId,
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
