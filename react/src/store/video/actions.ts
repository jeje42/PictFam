import {
  VideosState,
  START_VIDEOS_FETCHED,
  VIDEOS_FETCHED,
  VIDEOS_SELECTED,
  VIDEOS_SELECTED_NEXT,
  VIDEOS_SELECTED_PREVIOUS,
  NEW_ALBUM_SELECTED,
  StartVideossFetchedAction,
} from './types';
import { Video } from '../../types/Video';
import { Album } from '../../types/Album';

export function startVideosFetched(): StartVideossFetchedAction {
  return {
    type: START_VIDEOS_FETCHED,
    request: {
      method: 'get',
      url: '/photostree',
    },
  };
}

export function videosFetched(newVideos: VideosState) {
  return {
    type: VIDEOS_FETCHED,
    videos: newVideos,
  };
}

export function selectVideo(video: Video) {
  return {
    type: VIDEOS_SELECTED,
    video,
  };
}

export function selectNextVideo() {
  return {
    type: VIDEOS_SELECTED_NEXT,
  };
}

export function selectPreviousVideo() {
  return {
    type: VIDEOS_SELECTED_PREVIOUS,
  };
}

export function newAlbumSelected(albums: Album[]) {
  return {
    type: NEW_ALBUM_SELECTED,
    albums: albums,
  };
}
