import { AddPhotoToReducerAction, NewOrUpdatePhotoFromSocketSagaAction, PhotoAction, PhotosState, StartPhotosFetchedAction } from './types';
import { Photo } from '../../types/Photo';
import { Album } from '../../types/Album';

export function startPhotosFetched(): StartPhotosFetchedAction {
  return {
    type: PhotoAction.START_PHOTOS_FETCHED,
    request: {
      method: 'get',
      url: '/photostree',
    },
  };
}

export function photosFetched(newPhotos: PhotosState) {
  return {
    type: PhotoAction.PHOTOS_FETCHED,
    photos: newPhotos,
  };
}

export function selectPhoto(photo?: Photo) {
  return {
    type: PhotoAction.PHOTOS_SELECTED,
    photo,
  };
}

export function selectNextPhoto() {
  return {
    type: PhotoAction.PHOTOS_SELECTED_NEXT,
  };
}

export function selectPreviousPhoto() {
  return {
    type: PhotoAction.PHOTOS_SELECTED_PREVIOUS,
  };
}

export function newImageAlbumSelected(albums: Album[]) {
  return {
    type: PhotoAction.NEW_IMAGE_ALBUM_SELECTED,
    albums: albums,
  };
}

export const newOrUpdatePhotoFromSocketSagaAction = (photoId: string): NewOrUpdatePhotoFromSocketSagaAction => ({
  type: PhotoAction.NEW_OR_UPDATE_PHOTO_FROM_SOCKET_SAGA,
  photoId,
});

export const addPhotoToReducerAction = (photo: Photo): AddPhotoToReducerAction => ({
  type: PhotoAction.ADD_PHOTO_TO_REDUCER,
  photo,
});
