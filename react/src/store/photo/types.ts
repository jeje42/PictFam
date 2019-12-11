import { Photo } from '../../types/Photo'
export const PHOTOS_ADDED = 'PHOTOS_ADDED'

export interface PhotosState {
  photos: Array<Photo>
}

interface AddPhotosAction {
  type: typeof PHOTOS_ADDED
  photos: Array<Photo>
}

export type PhotoActionTypes = AddPhotosAction
