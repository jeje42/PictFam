import { PhotosState, PhotoActionTypes, PHOTOS_FETCHED, PHOTOS_SELECTED, PHOTOS_SELECTED_NEXT, PHOTOS_SELECTED_PREVIOUS, NEW_ALBUM_SELECTED } from './types'
import { Photo } from '../../types/Photo'
import { Album } from '../../types/Album'

const initialState: PhotosState = {
  photos: [],
  photosSelected: []
}

const photoSelected = (state: PhotosState, newPhotoSelected: Photo) => {
  return {
    ...state,
    photosSelected: state.photosSelected.map(photo => {
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
  let idPhoto:number = 1 + state.photosSelected.indexOf(state.photosSelected.filter(photo => photo.selected)[0])

  if(idPhoto === state.photosSelected.length) idPhoto = 0

  return photoSelected(state, state.photosSelected[idPhoto])
}

const selectedPreviousPhoto = (state: PhotosState) => {
  let idPhoto:number = state.photosSelected.indexOf(state.photosSelected.filter(photo => photo.selected)[0])

  if(idPhoto === 0) idPhoto = state.photosSelected.length - 1
  else if(idPhoto > 0) idPhoto--

  return photoSelected(state, state.photosSelected[idPhoto])
}

const newAlbumSelected = (state: PhotosState, albums: Array<Album>) => {
  let newPhotosSelected = state.photos.filter(photo => albums.filter(album => album.id === photo.album.id).length > 0 )

  return photoSelected({
    ...state,
    photosSelected: newPhotosSelected
  }, newPhotosSelected[0])
}

export function photosReducer (
  state = initialState,
  action: PhotoActionTypes
): PhotosState {
  switch (action.type) {
    case PHOTOS_FETCHED:
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
    case NEW_ALBUM_SELECTED:
      return newAlbumSelected(state, action.albums)
    default:
      return state
  }
}
