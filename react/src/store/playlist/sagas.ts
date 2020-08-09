import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosRequestConfig } from 'axios';
import { getRequest } from '../../utils/axiosUtils';
import { PLAYLIST_ACTION, PlaylistActionTypes, PlaylistFetched, PlaylistVideosFetched } from './types';
import { Playlist } from '../../types/Playlist';
import { Album } from '../../types/Album';
import { playlistsFetch } from './actions';

interface Response {
  data: PlaylistFetched[] | PlaylistFetched;
}

function* tryToFetchPlaylist(action: PlaylistActionTypes) {
  if (action.type !== PLAYLIST_ACTION.START_FETCH_ALL_PLAYLIST && action.type !== PLAYLIST_ACTION.START_FETCH_ONE_PLAYLIST) {
    return;
  }

  const options: AxiosRequestConfig = {
    ...action.request,
  };

  const response: Response = yield call(getRequest, options);

  const playListDataToList: PlaylistFetched[] =
    action.type === PLAYLIST_ACTION.START_FETCH_ALL_PLAYLIST ? (response.data as PlaylistFetched[]) : [response.data as PlaylistFetched];

  const playlists: Playlist[] = playListDataToList.map((value: PlaylistFetched) => {
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

  yield put(playlistsFetch(playlists));
}

export function* watchTryFetchAllPlaylists(): Generator {
  yield takeLatest(PLAYLIST_ACTION.START_FETCH_ALL_PLAYLIST, tryToFetchPlaylist);
}

export function* watchTryFetchOnePlaylists(): Generator {
  yield takeLatest(PLAYLIST_ACTION.START_FETCH_ONE_PLAYLIST, tryToFetchPlaylist);
}
