import { Photo } from '../../types/Photo';
import { Album } from '../../types/Album';
import { ActionRequest } from '../types';

export enum PhotoAction {
  START_PHOTOS_FETCHED = 'START_PHOTOS_FETCHED',
  PHOTOS_FETCHED = 'PHOTOS_FETCHED',
  PHOTOS_SELECTED = 'PHOTOS_SELECTED',
  PHOTOS_SELECTED_NEXT = 'PHOTOS_SELECTED_NEXT',
  PHOTOS_SELECTED_PREVIOUS = 'PHOTOS_SELECTED_PREVIOUS',
  NEW_ALBUM_SELECTED = 'NEW_ALBUM_SELECTED',
  INIT_PHOTOS_STATE = 'INIT_PHOTOS_STATE',

  NEW_OR_UPDATE_ALBUM_FROM_SOCKET_SAGA = 'NEW_OR_UPDATE_ALBUM_FROM_SOCKET_SAGA',
  ADD_PHOTO_TO_REDUCER = 'ADD_PHOTO_TO_REDUCER',
  UPDATE_ALBUM_FOR_PHOTOS = 'UPDATE_ALBUM_FOR_PHOTOS', //TODO
}

export interface PhotosState {
  photos: Photo[];
  photosSelected: Photo[];
}

export interface NewOrUpdatePhotoFromSocketSagaAction {
  type: typeof PhotoAction.NEW_OR_UPDATE_ALBUM_FROM_SOCKET_SAGA;
  photoId: string;
}

export interface StartPhotosFetchedAction extends ActionRequest {
  type: typeof PhotoAction.START_PHOTOS_FETCHED;
}

interface PhotosFetchedAction {
  type: typeof PhotoAction.PHOTOS_FETCHED;
  photos: PhotosState;
}

interface SelectPhotoAction {
  type: typeof PhotoAction.PHOTOS_SELECTED;
  photo: Photo;
}

interface SelectNextPhotoAction {
  type: typeof PhotoAction.PHOTOS_SELECTED_NEXT;
}

interface SelectPreviousPhotoAction {
  type: typeof PhotoAction.PHOTOS_SELECTED_PREVIOUS;
}

interface NewAlbumSelected {
  type: typeof PhotoAction.NEW_ALBUM_SELECTED;
  albums: Album[];
}

interface InitStateAction {
  type: typeof PhotoAction.INIT_PHOTOS_STATE;
}

export interface AddPhotoToReducerAction {
  type: typeof PhotoAction.ADD_PHOTO_TO_REDUCER;
  photo: Photo;
}

export type PhotoActionTypes =
  | StartPhotosFetchedAction
  | PhotosFetchedAction
  | SelectPhotoAction
  | SelectNextPhotoAction
  | SelectPreviousPhotoAction
  | NewAlbumSelected
  | InitStateAction
  | AddPhotoToReducerAction;
