import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import axios, { AxiosRequestConfig } from 'axios';
import { NewOrUpdatePhotoFromSocketSagaAction, PhotoAction, PhotoActionTypes, PhotosState } from './types';
import { Album } from '../../types/Album';
import { Photo, PhotoFetched } from '../../types/Photo';
import { getRequest } from '../../utils/axiosUtils';
import { Endpoints } from '../../config/endpoints';
import { addPhotoToReducerAction } from './actions';
import { photoFetchedToPhoto } from './utils';

interface PhotoResponse {
  id: number;
  name: string;
  album: Album;
}

interface Response {
  data: PhotoResponse[];
}

function* tryToFetchPhotos(action: PhotoActionTypes) {
  if (action.type !== PhotoAction.START_PHOTOS_FETCHED) {
    return;
  }

  const options: AxiosRequestConfig = {
    ...action.request,
    params: {
      dataType: 'image',
    },
  };

  const response: Response = yield call(getRequest, options);

  const newPhotosState: PhotosState = {
    photos: response.data.map((value: PhotoResponse) => {
      return {
        id: value.id,
        name: value.name,
        selected: false,
        album: value.album,
      } as Photo;
    }),
    photosSelected: [],
  };

  yield put({
    type: PhotoAction.PHOTOS_FETCHED,
    photos: newPhotosState,
  });
}

export function* watchTryFetchPhotos() {
  yield takeLatest(PhotoAction.START_PHOTOS_FETCHED, tryToFetchPhotos);
}

function* newOrUpdatePhoto(action: NewOrUpdatePhotoFromSocketSagaAction) {
  debugger;
  const token = yield select(state => state.auth.token);

  const requestConfig: AxiosRequestConfig = {
    method: 'GET',
    url: `${Endpoints.Photos}/${action.photoId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const r = yield axios(requestConfig);
  const response = r as { data: PhotoFetched };

  const photoAlbumRequest: AxiosRequestConfig = {
    method: 'GET',
    url: response.data._links.album.href.substring(response.data._links.album.href.indexOf('/api')),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const photoAlbumR = yield axios(photoAlbumRequest);
  const photoAlbumResponse = photoAlbumR as { data: Album };

  yield put(addPhotoToReducerAction(photoFetchedToPhoto(response.data, photoAlbumResponse.data)));
}

export function* watchNewOrUpdatePhoto() {
  yield takeEvery(PhotoAction.NEW_OR_UPDATE_ALBUM_FROM_SOCKET_SAGA, newOrUpdatePhoto);
}
