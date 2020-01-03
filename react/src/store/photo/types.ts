import { Photo } from '../../types/Photo'
import { Album } from '../../types/Album'

export const PHOTOS_ADDED = 'PHOTOS_ADDED'
export const PHOTOS_SELECTED = 'PHOTOS_SELECTED'
export const PHOTOS_SELECTED_NEXT = 'PHOTOS_SELECTED_NEXT'
export const PHOTOS_SELECTED_PREVIOUS = 'PHOTOS_SELECTED_PREVIOUS'
export const NEW_ALBUM_SELECTED = 'NEW_ALBUM_SELECTED'

export interface PhotosState {
  photos: Array<Photo>,
  photosSelected: Array<Photo>
}

interface AddPhotosAction {
  type: typeof PHOTOS_ADDED
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

export type PhotoActionTypes = AddPhotosAction | SelectPhotoAction | SelectNextPhotoAction | SelectPreviousPhotoAction | NewAlbumSelected
