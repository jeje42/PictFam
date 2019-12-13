import { PhotosState, PHOTOS_ADDED } from "./types";


export function addPhotos(newPhotos: PhotosState) {
  return {
    type: PHOTOS_ADDED,
    photos: newPhotos
  }
}
