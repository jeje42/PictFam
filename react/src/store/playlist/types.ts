import { ActionRequest } from '../types';
import { Playlist } from '../../types/Playlist';

export enum PLAYLIST_ACTION {
  START_PLAYLIST_FETCHED = 'START_PLAYLIST_FETCHED',
  SET_PLAYLIST = 'SET_PLAYLIST',
  PLAYLIST_FETCHED = 'PLAYLIST_FETCHED',
  PLAYLIST_SELECTED = 'PLAYLIST_SELECTED',
  INIT_PLAYLIST_STATE = 'INIT_PLAYLIST_STATE',
}

export interface PlaylistsState {
  playlists: Playlist[];
}

export interface StartPlaylistsFetchedAction extends ActionRequest {
  type: typeof PLAYLIST_ACTION.START_PLAYLIST_FETCHED;
}

export interface PlaylistsFetchedAction {
  type: typeof PLAYLIST_ACTION.PLAYLIST_FETCHED;
  playlists: Playlist[];
}

export interface SetPlaylist {
  type: PLAYLIST_ACTION.SET_PLAYLIST;
  playlist: Playlist;
}

export interface SelectPlaylistAction {
  type: typeof PLAYLIST_ACTION.PLAYLIST_SELECTED;
  playlist?: Playlist;
}

export interface InitStateAction {
  type: typeof PLAYLIST_ACTION.INIT_PLAYLIST_STATE;
}

export type PlaylistActionTypes = StartPlaylistsFetchedAction | PlaylistsFetchedAction | SetPlaylist | SelectPlaylistAction | InitStateAction;
