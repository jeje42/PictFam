import { PhotosState, PhotoActionTypes, PHOTOS_ADDED, PHOTOS_SELECTED, PHOTOS_SELECTED_NEXT, PHOTOS_SELECTED_PREVIOUS } from './types'
import { Photo } from '../../types/Photo'

const initialState: PhotosState = {
  photos: []
}

const photoSelected = (state: PhotosState, newPhotoSelected: Photo) => {
  return {
    ...state,
    photos: state.photos.map(photo => {
      if(photo.selected && newPhotoSelected.id !== photo.id) {
        photo.selected = false
      }

      if(newPhotoSelected.id === photo.id) {
        photo.selected = true
      }

      return photo
    })
  }
}

const selectedNextPhoto = (state: PhotosState) => {
  let idPhoto:number = 1 + state.photos.indexOf(state.photos.filter(photo => photo.selected)[0])

  if(idPhoto === state.photos.length) idPhoto = 0

  return photoSelected(state, state.photos[idPhoto])
}

const selectedPreviousPhoto = (state: PhotosState) => {
  let idPhoto:number = state.photos.indexOf(state.photos.filter(photo => photo.selected)[0])

  if(idPhoto === -1) idPhoto = 0
  else if(idPhoto > 0) idPhoto--

  return photoSelected(state, state.photos[idPhoto])
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
    case PHOTOS_SELECTED:
      return photoSelected(state, action.photo)
    case PHOTOS_SELECTED_NEXT:
      return selectedNextPhoto(state)
    case PHOTOS_SELECTED_PREVIOUS:
      return selectedPreviousPhoto(state)
    default:
      return state
  }
}
