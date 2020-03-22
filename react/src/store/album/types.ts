import { Album } from '../../types/Album';
import { ActionRequest } from '../types';

export const START_ALBUM_IMAGE_FETCHED = 'START_ALBUM_IMAGE_FETCHED';
export const ALBUM_IMAGE_FETCHED = 'ALBUM_IMAGE_FETCHED';
export const ALBUM_IMAGE_SELECTED = 'ALBUM_IMAGE_SELECTED';
export const START_ALBUM_VIDEO_FETCHED = 'START_ALBUM_VIDEO_FETCHED';
export const ALBUM_VIDEO_FETCHED = 'ALBUM_VIDEO_FETCHED';
export const ALBUM_VIDEO_SELECTED = 'ALBUM_VIDEO_SELECTED';
export const INIT_ALBUMSTATE = 'INIT_ALBUMSTATE';

export interface AlbumState {
  albumsImage: Album[];
  albumImageIdSelected: number;
  albumsVideo: Album[];
  albumVideoIdSelected: number;
}

export interface StartFetchAlbumsImageAction extends ActionRequest {
  type: typeof START_ALBUM_IMAGE_FETCHED;
}

export interface AlbumImageFetchedAction {
  type: typeof ALBUM_IMAGE_FETCHED;
  albums: Album[];
}

export interface SelectAlbumImageAction {
  type: typeof ALBUM_IMAGE_SELECTED;
  albumId: number;
}

export interface StartFetchAlbumsVideoAction extends ActionRequest {
  type: typeof START_ALBUM_VIDEO_FETCHED;
}

export interface AlbumVideoFetchedAction {
  type: typeof ALBUM_VIDEO_FETCHED;
  albums: Album[];
}

export interface SelectAlbumVideoAction {
  type: typeof ALBUM_VIDEO_SELECTED;
  albumId: number;
}

export interface InitAlbumStateAction {
  type: typeof INIT_ALBUMSTATE;
}

export type AlbumActionTypes =
  | StartFetchAlbumsImageAction
  | AlbumImageFetchedAction
  | SelectAlbumImageAction
  | InitAlbumStateAction
  | StartFetchAlbumsVideoAction
  | AlbumVideoFetchedAction
  | SelectAlbumVideoAction;
