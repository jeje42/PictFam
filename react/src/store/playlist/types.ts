import { ActionRequest } from '../types';
import { Playlist } from '../../types/Playlist';

export enum PLAYLIST_ACTION {
  START_FETCH_ALL_PLAYLIST = 'START_FETCH_ALL_PLAYLIST',
  START_FETCH_ONE_PLAYLIST = 'START_FETCH_ONE_PLAYLIST',
  SET_PLAYLIST = 'SET_PLAYLIST',
  REMOVE_PLAYLIST = 'REMOVE_PLAYLIST',
  PLAYLIST_FETCHED = 'PLAYLIST_FETCHED',
  PLAYLIST_SELECTED = 'PLAYLIST_SELECTED',
  INIT_PLAYLIST_STATE = 'INIT_PLAYLIST_STATE',
}

export interface PlaylistsState {
  playlists: Playlist[];
}

export interface StartFetchAllPlaylistsAction extends ActionRequest {
  type: typeof PLAYLIST_ACTION.START_FETCH_ALL_PLAYLIST;
}

export interface StartFetchOnePlaylistsAction extends ActionRequest {
  type: typeof PLAYLIST_ACTION.START_FETCH_ONE_PLAYLIST;
}

export interface PlaylistsFetchedAction {
  type: typeof PLAYLIST_ACTION.PLAYLIST_FETCHED;
  playlists: Playlist[];
}

export interface SetPlaylist {
  type: PLAYLIST_ACTION.SET_PLAYLIST;
  playlist: Playlist;
}

export interface RemovePlaylist {
  type: PLAYLIST_ACTION.REMOVE_PLAYLIST;
  playlistId: string;
}

export interface SelectPlaylistAction {
  type: typeof PLAYLIST_ACTION.PLAYLIST_SELECTED;
  playlist?: Playlist;
}

export interface InitStateAction {
  type: typeof PLAYLIST_ACTION.INIT_PLAYLIST_STATE;
}

export type PlaylistActionTypes =
  | StartFetchAllPlaylistsAction
  | StartFetchOnePlaylistsAction
  | PlaylistsFetchedAction
  | SetPlaylist
  | SelectPlaylistAction
  | RemovePlaylist
  | InitStateAction;

export interface PlaylistVideosFetched {
  videoId: number;
  videoName: string;
  position: number;
}

export interface PlaylistFetched {
  id: number;
  name: string;
  playlistVideos: PlaylistVideosFetched[];
}
