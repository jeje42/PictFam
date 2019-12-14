import { PhotosState, PHOTOS_ADDED, PHOTOS_SELECTED, PHOTOS_SELECTED_NEXT, PHOTOS_SELECTED_PREVIOUS } from "./types";
import { Photo } from '../../types/Photo'


export function addPhotos(newPhotos: PhotosState) {
  return {
    type: PHOTOS_ADDED,
    photos: newPhotos
  }
}

export function selectPhoto(photo: Photo) {
  return {
    type: PHOTOS_SELECTED,
    photo: photo
  }
}

export function selectNextPhoto() {
  return {
    type: PHOTOS_SELECTED_NEXT
  }
}

export function selectPreviousPhoto() {
  return {
    type: PHOTOS_SELECTED_PREVIOUS
  }
}
