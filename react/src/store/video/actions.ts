import {
  AddVideoToReducerAction,
  NewAlbumSelected,
  NewOrUpdateVideoFromSocketSagaAction,
  SelectNextVideoAction,
  SelectPreviousVideoAction,
  SelectVideoAction,
  SelectVideoForReading,
  StartVideossFetchedAction,
  VideoAction,
  VideosFetchedAction,
  VideosState,
} from './types';
import { Video } from '../../types/Video';
import { Album } from '../../types/Album';

export function startVideosFetched(): StartVideossFetchedAction {
  return {
    type: VideoAction.START_VIDEOS_FETCHED,
    request: {
      method: 'get',
      url: '/photostree',
    },
  };
}

export const videosFetched = (newVideos: VideosState): VideosFetchedAction => {
  return {
    type: VideoAction.VIDEOS_FETCHED,
    videos: newVideos,
  };
};

export const selectVideo = (video: Video): SelectVideoAction => {
  return {
    type: VideoAction.VIDEOS_SELECTED,
    video,
  };
};

export const selectNextVideo = (): SelectNextVideoAction => {
  return {
    type: VideoAction.VIDEOS_SELECTED_NEXT,
  };
};

export const selectPreviousVideo = (): SelectPreviousVideoAction => {
  return {
    type: VideoAction.VIDEOS_SELECTED_PREVIOUS,
  };
};

export const newAlbumSelected = (albums: Album[]): NewAlbumSelected => {
  return {
    type: VideoAction.NEW_ALBUM_VIDEO_SELECTED,
    albums: albums,
  };
};

export const selectVideoForReading = (video: Video): SelectVideoForReading => {
  return {
    type: VideoAction.SELECT_VIDEO_FOR_READING,
    video: video,
  };
};

export const newOrUpdateVideoFromSocketSagaAction = (videoId: string): NewOrUpdateVideoFromSocketSagaAction => ({
  type: VideoAction.NEW_OR_UPDATE_VIDEO_FROM_SOCKET_SAGA,
  videoId,
});

export const addVideoToReducerAction = (video: Video): AddVideoToReducerAction => ({
  type: VideoAction.ADD_VIDEO_TO_REDUCER,
  video,
});
