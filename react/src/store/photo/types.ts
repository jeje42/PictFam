import { Photo } from '../../types/Photo'
import { Album } from '../../types/Album'

export const START_PHOTOS_FETCHED = 'START_PHOTOS_FETCHED'
export const PHOTOS_FETCHED = 'PHOTOS_FETCHED'
export const PHOTOS_SELECTED = 'PHOTOS_SELECTED'
export const PHOTOS_SELECTED_NEXT = 'PHOTOS_SELECTED_NEXT'
export const PHOTOS_SELECTED_PREVIOUS = 'PHOTOS_SELECTED_PREVIOUS'
export const NEW_ALBUM_SELECTED = 'NEW_ALBUM_SELECTED'
export const INIT_PHOTOS_STATE = 'INIT_PHOTOS_STATE'

export interface PhotosState {
  photos: Array<Photo>,
  photosSelected: Array<Photo>
}

interface StartPhotosFetchedAction {
  type: typeof START_PHOTOS_FETCHED
  token: string
}

interface PhotosFetchedAction {
  type: typeof PHOTOS_FETCHED
  photos: PhotosState
}

interface SelectPhotoAction {
  type: typeof PHOTOS_SELECTED
  photo: Photo
}

interface SelectNextPhotoAction {
  type: typeof PHOTOS_SELECTED_NEXT
}

interface SelectPreviousPhotoAction {
  type: typeof PHOTOS_SELECTED_PREVIOUS
}

interface NewAlbumSelected {
  type: typeof NEW_ALBUM_SELECTED,
  albums: Array<Album>
}

interface InitStateAction {
  type: typeof INIT_PHOTOS_STATE
}

export type PhotoActionTypes = StartPhotosFetchedAction | PhotosFetchedAction | SelectPhotoAction | SelectNextPhotoAction | SelectPreviousPhotoAction | NewAlbumSelected | InitStateAction
