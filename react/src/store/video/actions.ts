import {
  VideosState,
  START_VIDEOS_FETCHED,
  VIDEOS_FETCHED,
  VIDEOS_SELECTED,
  VIDEOS_SELECTED_NEXT,
  VIDEOS_SELECTED_PREVIOUS,
  NEW_ALBUM_VIDEO_SELECTED,
  StartVideossFetchedAction,
  SELECT_VIDEO_FOR_READING,
  SelectVideoForReading,
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
    type: NEW_ALBUM_VIDEO_SELECTED,
    albums: albums,
  };
}

export function selectVideoForReading(video: Video): SelectVideoForReading {
  return {
    type: SELECT_VIDEO_FOR_READING,
    video: video,
  };
}
