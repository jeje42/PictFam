import { Photo } from '../../types/Photo';
import { Album } from '../../types/Album';
import { ActionRequest } from '../types';

export const START_PHOTOS_FETCHED = 'START_PHOTOS_FETCHED';
export const PHOTOS_FETCHED = 'PHOTOS_FETCHED';
export const PHOTOS_SELECTED = 'PHOTOS_SELECTED';
export const PHOTOS_SELECTED_NEXT = 'PHOTOS_SELECTED_NEXT';
export const PHOTOS_SELECTED_PREVIOUS = 'PHOTOS_SELECTED_PREVIOUS';
export const NEW_ALBUM_SELECTED = 'NEW_ALBUM_SELECTED';
export const INIT_PHOTOS_STATE = 'INIT_PHOTOS_STATE';

export interface PhotosState {
  photos: Photo[];
  photosSelected: Photo[];
}

export interface StartPhotosFetchedAction extends ActionRequest {
  type: typeof START_PHOTOS_FETCHED;
}

interface PhotosFetchedAction {
  type: typeof PHOTOS_FETCHED;
  photos: PhotosState;
}

interface SelectPhotoAction {
  type: typeof PHOTOS_SELECTED;
  photo: Photo;
}

interface SelectNextPhotoAction {
  type: typeof PHOTOS_SELECTED_NEXT;
}

interface SelectPreviousPhotoAction {
  type: typeof PHOTOS_SELECTED_PREVIOUS;
}

interface NewAlbumSelected {
  type: typeof NEW_ALBUM_SELECTED;
  albums: Album[];
}

interface InitStateAction {
  type: typeof INIT_PHOTOS_STATE;
}

export type PhotoActionTypes =
  | StartPhotosFetchedAction
  | PhotosFetchedAction
  | SelectPhotoAction
  | SelectNextPhotoAction
  | SelectPreviousPhotoAction
  | NewAlbumSelected
  | InitStateAction;
