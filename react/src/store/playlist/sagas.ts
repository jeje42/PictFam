import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosRequestConfig } from 'axios';
import { getRequest } from '../../utils/axiosUtils';
import { PLAYLIST_ACTION, PlaylistActionTypes } from './types';
import { Playlist } from '../../types/Playlist';

interface Response {
  data: Playlist[];
}

function* tryToFetchPlaylists(action: PlaylistActionTypes) {
  if (action.type !== PLAYLIST_ACTION.START_PLAYLIST_FETCHED) {
    return;
  }

  const options: AxiosRequestConfig = {
    ...action.request,
  };

  const response: Response = yield call(getRequest, options);

  const playlists: Playlist[] = response.data.map((value: Playlist) => {
    return {
      id: value.id,
      name: value.name,
      selected: false,
      videos: value.videos,
    };
  });

  yield put({
    type: PLAYLIST_ACTION.PLAYLIST_FETCHED,
    playlists,
  });
}

export function* watchTryFetchPlaylists() {
  yield takeLatest(PLAYLIST_ACTION.START_PLAYLIST_FETCHED, tryToFetchPlaylists);
}
