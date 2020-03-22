import {
  ALBUM_IMAGE_FETCHED,
  ALBUM_IMAGE_SELECTED,
  ALBUM_VIDEO_FETCHED,
  ALBUM_VIDEO_SELECTED,
  AlbumImageFetchedAction,
  AlbumVideoFetchedAction,
  SelectAlbumImageAction,
  SelectAlbumVideoAction,
  START_ALBUM_IMAGE_FETCHED,
  START_ALBUM_VIDEO_FETCHED,
  StartFetchAlbumsImageAction,
  StartFetchAlbumsVideoAction,
} from './types';
import { Album } from '../../types/Album';

export function startFetchAlbumsImage(): StartFetchAlbumsImageAction {
  return {
    type: START_ALBUM_IMAGE_FETCHED,
    request: {
      method: 'get',
      url: '/albumstree',
    },
  };
}

export function albumsImageFetch(newAlbums: Album[]): AlbumImageFetchedAction {
  return {
    type: ALBUM_IMAGE_FETCHED,
    albums: newAlbums,
  };
}

export function selectAlbumImage(albumId: number): SelectAlbumImageAction {
  return {
    type: ALBUM_IMAGE_SELECTED,
    albumId,
  };
}

export function startFetchAlbumsVideo(): StartFetchAlbumsVideoAction {
  return {
    type: START_ALBUM_VIDEO_FETCHED,
    request: {
      method: 'get',
      url: '/albumstree',
    },
  };
}

export function albumsVideoFetch(newAlbums: Album[]): AlbumVideoFetchedAction {
  return {
    type: ALBUM_VIDEO_FETCHED,
    albums: newAlbums,
  };
}

export function selectAlbumVideo(albumId: number): SelectAlbumVideoAction {
  return {
    type: ALBUM_VIDEO_SELECTED,
    albumId,
  };
}
