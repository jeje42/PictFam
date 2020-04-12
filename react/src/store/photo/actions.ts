import {
  PhotosState,
  START_PHOTOS_FETCHED,
  PHOTOS_FETCHED,
  PHOTOS_SELECTED,
  PHOTOS_SELECTED_NEXT,
  PHOTOS_SELECTED_PREVIOUS,
  NEW_ALBUM_SELECTED,
  StartPhotosFetchedAction,
} from './types';
import { Photo } from '../../types/Photo';
import { Album } from '../../types/Album';

export function startPhotosFetched(): StartPhotosFetchedAction {
  return {
    type: START_PHOTOS_FETCHED,
    request: {
      method: 'get',
      url: '/photostree',
    },
  };
}

export function photosFetched(newPhotos: PhotosState) {
  return {
    type: PHOTOS_FETCHED,
    photos: newPhotos,
  };
}

export function selectPhoto(photo?: Photo) {
  return {
    type: PHOTOS_SELECTED,
    photo,
  };
}

export function selectNextPhoto() {
  return {
    type: PHOTOS_SELECTED_NEXT,
  };
}

export function selectPreviousPhoto() {
  return {
    type: PHOTOS_SELECTED_PREVIOUS,
  };
}

export function newAlbumSelected(albums: Album[]) {
  return {
    type: NEW_ALBUM_SELECTED,
    albums: albums,
  };
}
