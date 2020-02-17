import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosRequestConfig } from 'axios';
import { PhotoActionTypes, START_PHOTOS_FETCHED, PHOTOS_FETCHED, PhotosState } from './types';
import { Album } from '../../types/Album';
import { Photo } from '../../types/Photo';
import { getRequest } from '../../utils/axiosUtils';

interface PhotoResponse {
  id: number;
  name: string;
  album: Album;
}

interface Response {
  data: PhotoResponse[];
}

function* tryToFetchPhotos(action: PhotoActionTypes) {
  if (action.type !== START_PHOTOS_FETCHED) {
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
    type: PHOTOS_FETCHED,
    photos: newPhotosState,
  });
}

export function* watchTryFetchPhotos() {
  yield takeLatest(START_PHOTOS_FETCHED, tryToFetchPhotos);
}
