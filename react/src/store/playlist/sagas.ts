import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosRequestConfig } from 'axios';
import { getRequest } from '../../utils/axiosUtils';
import { PLAYLIST_ACTION, PlaylistActionTypes, PlaylistFetched, PlaylistVideosFetched } from './types';
import { Playlist } from '../../types/Playlist';
import { Album } from '../../types/Album';

interface Response {
  data: PlaylistFetched[];
}

function* tryToFetchPlaylists(action: PlaylistActionTypes) {
  if (action.type !== PLAYLIST_ACTION.START_PLAYLIST_FETCHED) {
    return;
  }

  const options: AxiosRequestConfig = {
    ...action.request,
  };

  const response: Response = yield call(getRequest, options);

  const playlists: Playlist[] = response.data.map((value: PlaylistFetched) => {
    const sortedPlaylistVideos = value.playlistVideos.sort((a: PlaylistVideosFetched, b: PlaylistVideosFetched) => a.position - b.position);

    return {
      id: value.id,
      name: value.name,
      selected: false,
      videos: sortedPlaylistVideos.map(playlistVideo => ({
        id: playlistVideo.videoId,
        name: playlistVideo.videoName,
        selected: false,
        album: {} as Album,
      })),
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
