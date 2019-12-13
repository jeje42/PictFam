import { PhotosState, PhotoActionTypes, PHOTOS_ADDED } from './types'

const initialState: PhotosState = {
  photos: []
}

export function photosReducer (
  state = initialState,
  action: PhotoActionTypes
): PhotosState {
  switch (action.type) {
    case PHOTOS_ADDED:
      return {
        ...state,
        ...action.photos
      }
    default:
      return state
  }
}
