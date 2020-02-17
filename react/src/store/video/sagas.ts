import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosRequestConfig } from 'axios';
import { VideoActionTypes, START_VIDEOS_FETCHED, VIDEOS_FETCHED, VideosState } from './types';
import { Album } from '../../types/Album';
import { Video } from '../../types/Video';
import { getRequest } from '../../utils/axiosUtils';

interface VideoResponse {
  id: number;
  name: string;
  album: Album;
}

interface Response {
  data: VideoResponse[];
}

function* tryToFetchVideos(action: VideoActionTypes) {
  if (action.type !== START_VIDEOS_FETCHED) {
    return;
  }

  const options: AxiosRequestConfig = {
    ...action.request,
    params: {
      dataType: 'video',
    },
  };

  const response: Response = yield call(getRequest, options);

  const newVideosState: VideosState = {
    videos: response.data.map((value: VideoResponse) => {
      return {
        id: value.id,
        name: value.name,
        selected: false,
        album: value.album,
      } as Video;
    }),
    videosSelected: [],
  };

  yield put({
    type: VIDEOS_FETCHED,
    videos: newVideosState,
  });
}

export function* watchTryFetchVideos() {
  yield takeLatest(START_VIDEOS_FETCHED, tryToFetchVideos);
}
