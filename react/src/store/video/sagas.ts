import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import axios, { AxiosRequestConfig } from 'axios';
import { VideoActionTypes, VideosState, VideoAction, NewOrUpdateVideoFromSocketSagaAction } from './types';
import { Album } from '../../types/Album';
import { Video, VideoFetched } from '../../types/Video';
import { getRequest } from '../../utils/axiosUtils';
import { Endpoints } from '../../config/endpoints';
import { videoFetchedToVideo } from './utils';
import { addVideoToReducerAction, videosFetched } from './actions';

interface VideoResponse {
  id: number;
  name: string;
  album: Album;
}

interface Response {
  data: VideoResponse[];
}

function* tryToFetchVideos(action: VideoActionTypes) {
  if (action.type !== VideoAction.START_VIDEOS_FETCHED) {
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

  yield put(videosFetched(newVideosState));
}

export function* watchTryFetchVideos() {
  yield takeLatest(VideoAction.START_VIDEOS_FETCHED, tryToFetchVideos);
}

function* newOrUpdateVideo(action: NewOrUpdateVideoFromSocketSagaAction) {
  const token = yield select(state => state.auth.token);

  const requestConfig: AxiosRequestConfig = {
    method: 'GET',
    url: `${Endpoints.Videos}/${action.videoId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const r = yield axios(requestConfig);
  const response = r as { data: VideoFetched };

  const videoAlbumRequest: AxiosRequestConfig = {
    method: 'GET',
    url: response.data._links!.album.href.substring(response.data._links!.album.href.indexOf('/api')),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const videoAlbumR = yield axios(videoAlbumRequest);
  const videoAlbumResponse = videoAlbumR as { data: Album };

  yield put(addVideoToReducerAction(videoFetchedToVideo(response.data, videoAlbumResponse.data)));
}

export function* watchNewOrUpdateVideo() {
  yield takeEvery(VideoAction.NEW_OR_UPDATE_VIDEO_FROM_SOCKET_SAGA, newOrUpdateVideo);
}
