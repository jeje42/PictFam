import {
  VideosState,
  VIDEOS_FETCHED,
  VIDEOS_SELECTED,
  VIDEOS_SELECTED_NEXT,
  VIDEOS_SELECTED_PREVIOUS,
  INIT_VIDEOS_STATE,
  VideoActionTypes,
  SELECT_VIDEO_FOR_READING,
  NEW_ALBUM_VIDEO_SELECTED,
} from './types';
import { Video } from '../../types/Video';
import { Album } from '../../types/Album';

const initialState: VideosState = {
  videos: [],
  videosSelected: [],
  videoReading: undefined,
};

/**
 * Updates the selected attribute of the videos of the current album.
 * @param state
 * @param newVideoSelected
 */
const videoSelected = (state: VideosState, newVideoSelected: Video) => {
  return {
    ...state,
    videosSelected: state.videosSelected.map(video => {
      if (video.selected && newVideoSelected.id !== video.id) {
        video.selected = false;
      }

      if (newVideoSelected.id === video.id) {
        video.selected = true;
      }

      return video;
    }),
  };
};

const selectedNextVideo = (state: VideosState) => {
  let idVideo: number = 1 + state.videosSelected.indexOf(state.videosSelected.filter(video => video.selected)[0]);

  if (idVideo === state.videosSelected.length) idVideo = 0;

  return videoSelected(state, state.videosSelected[idVideo]);
};

const selectedPreviousVideo = (state: VideosState) => {
  let idVideo: number = state.videosSelected.indexOf(state.videosSelected.filter(video => video.selected)[0]);

  if (idVideo === 0) idVideo = state.videosSelected.length - 1;
  else if (idVideo > 0) idVideo--;

  return videoSelected(state, state.videosSelected[idVideo]);
};

const newAlbumSelected = (state: VideosState, albums: Album[]) => {
  const newVideosSelected = state.videos.filter(video => albums.filter(album => album.id === video.album.id).length > 0);

  return videoSelected(
    {
      ...state,
      videosSelected: newVideosSelected,
    },
    newVideosSelected[0],
  );
};

const selectVideoForReading = (state: VideosState, video: Video): VideosState => {
  return {
    ...state,
    videoReading: video,
  };
};

export function videosReducer(state = initialState, action: VideoActionTypes): VideosState {
  switch (action.type) {
    case VIDEOS_FETCHED:
      return {
        ...state,
        ...action.videos,
      };
    case VIDEOS_SELECTED:
      return videoSelected(state, action.video);
    case VIDEOS_SELECTED_NEXT:
      return selectedNextVideo(state);
    case VIDEOS_SELECTED_PREVIOUS:
      return selectedPreviousVideo(state);
    case NEW_ALBUM_VIDEO_SELECTED:
      return newAlbumSelected(state, action.albums);
    case INIT_VIDEOS_STATE:
      return initialState;
    case SELECT_VIDEO_FOR_READING:
      return selectVideoForReading(state, action.video);
    default:
      return state;
  }
}
