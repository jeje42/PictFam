import { PhotoAction, PhotoActionTypes, PhotosState } from './types';
import { Photo } from '../../types/Photo';
import { Album } from '../../types/Album';

const initialState: PhotosState = {
  photos: [],
  photosSelected: [],
};

const photoSelected = (state: PhotosState, newPhotoSelected?: Photo) => {
  return {
    ...state,
    photosSelected: state.photosSelected.map(photo => {
      if (!newPhotoSelected) {
        photo.selected = false;
      } else {
        if (photo.selected && newPhotoSelected.id !== photo.id) {
          photo.selected = false;
        }

        if (newPhotoSelected.id === photo.id) {
          photo.selected = true;
        }
      }

      return photo;
    }),
  };
};

const selectedNextPhoto = (state: PhotosState) => {
  let idPhoto: number = 1 + state.photosSelected.indexOf(state.photosSelected.filter(photo => photo.selected)[0]);

  if (idPhoto === state.photosSelected.length) idPhoto = 0;

  return photoSelected(state, state.photosSelected[idPhoto]);
};

const selectedPreviousPhoto = (state: PhotosState) => {
  let idPhoto: number = state.photosSelected.indexOf(state.photosSelected.filter(photo => photo.selected)[0]);

  if (idPhoto === 0) idPhoto = state.photosSelected.length - 1;
  else if (idPhoto > 0) idPhoto--;

  return photoSelected(state, state.photosSelected[idPhoto]);
};

const newAlbumSelected = (state: PhotosState, albums: Album[]) => {
  const newPhotosSelected = state.photos.filter(photo => albums.filter(album => album && album.id === photo.album.id).length > 0);
  return {
    ...state,
    photosSelected: newPhotosSelected,
  };
};

const addPhotoToReducer = (state: PhotosState, photo: Photo): PhotosState => {
  let updated = false;
  const newState: PhotosState = {
    ...state,
    photos: state.photos.map(p => {
      if (p.id === photo.id) {
        updated = true;
        return photo;
      }
      return p;
    }),
  };

  if (updated) {
    return newState;
  }

  return {
    ...state,
    photos: [...state.photos, ...[photo]],
  };
};

export function photosReducer(state = initialState, action: PhotoActionTypes): PhotosState {
  switch (action.type) {
    case PhotoAction.PHOTOS_FETCHED:
      return {
        ...state,
        ...action.photos,
      };
    case PhotoAction.PHOTOS_SELECTED:
      return photoSelected(state, action.photo);
    case PhotoAction.PHOTOS_SELECTED_NEXT:
      return selectedNextPhoto(state);
    case PhotoAction.PHOTOS_SELECTED_PREVIOUS:
      return selectedPreviousPhoto(state);
    case PhotoAction.NEW_IMAGE_ALBUM_SELECTED:
      return newAlbumSelected(state, action.albums);
    case PhotoAction.ADD_PHOTO_TO_REDUCER:
      return addPhotoToReducer(state, action.photo);
    case PhotoAction.INIT_PHOTOS_STATE:
      return initialState;
    default:
      return state;
  }
}
