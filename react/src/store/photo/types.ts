import { Photo } from '../../types/Photo'

export const PHOTOS_ADDED = 'PHOTOS_ADDED'

export interface PhotosState {
  photos: Array<Photo>
}

interface AddPhotosAction {
  type: typeof PHOTOS_ADDED
  photos: PhotosState
}

export type PhotoActionTypes = AddPhotosAction
