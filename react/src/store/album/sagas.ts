import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosRequestConfig } from 'axios';
import { Album } from '../../types/Album';
import { ALBUM_IMAGE_FETCHED, ALBUM_VIDEO_FETCHED, AlbumActionTypes, START_ALBUM_IMAGE_FETCHED, START_ALBUM_VIDEO_FETCHED } from './types';
import { getRequest } from '../../utils/axiosUtils';

interface Response {
  data: Album[];
}

function* tryToFetchAlbumsImage(action: AlbumActionTypes) {
  if (action.type !== START_ALBUM_IMAGE_FETCHED) {
    return;
  }

  const options: AxiosRequestConfig = {
    ...action.request,
    params: {
      albumType: 'image',
    },
  };

  const response: Response = yield call(getRequest, options);

  yield put({
    type: ALBUM_IMAGE_FETCHED,
    albums: response.data,
  });
}

function* tryToFetchAlbumsVideo(action: AlbumActionTypes) {
  if (action.type !== START_ALBUM_VIDEO_FETCHED) {
    return;
  }

  const options: AxiosRequestConfig = {
    ...action.request,
    params: {
      albumType: 'video',
    },
  };

  const response: Response = yield call(getRequest, options);

  yield put({
    type: ALBUM_VIDEO_FETCHED,
    albums: response.data,
  });
}

export function* watchTryFetchAlbumsImage() {
  yield takeLatest(START_ALBUM_IMAGE_FETCHED, tryToFetchAlbumsImage);
}

export function* watchTryFetchAlbumsVideo() {
  yield takeLatest(START_ALBUM_VIDEO_FETCHED, tryToFetchAlbumsVideo);
}
