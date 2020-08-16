import { Video } from '../../types/Video';
import { Album } from '../../types/Album';
import { ActionRequest } from '../types';

export enum VideoAction {
  START_VIDEOS_FETCHED = 'START_VIDEOS_FETCHED',
  VIDEOS_FETCHED = 'VIDEOS_FETCHED',
  VIDEOS_SELECTED = 'VIDEOS_SELECTED',
  VIDEOS_SELECTED_NEXT = 'VIDEOS_SELECTED_NEXT',
  VIDEOS_SELECTED_PREVIOUS = 'VIDEOS_SELECTED_PREVIOUS',
  NEW_VIDEO_ALBUM_SELECTED = 'NEW_VIDEO_ALBUM_SELECTED',
  INIT_VIDEOS_STATE = 'INIT_VIDEOS_STATE',
  SELECT_VIDEO_FOR_READING = 'SELECT_VIDEO_FOR_READING',

  NEW_OR_UPDATE_VIDEO_FROM_SOCKET_SAGA = 'NEW_OR_UPDATE_VIDEO_FROM_SOCKET_SAGA',
  ADD_VIDEO_TO_REDUCER = 'ADD_VIDEO_TO_REDUCER',
}

export interface VideosState {
  videos: Video[];
  videosSelected: Video[];
  videoReading?: Video;
}

export interface StartVideossFetchedAction extends ActionRequest {
  type: typeof VideoAction.START_VIDEOS_FETCHED;
}

export interface VideosFetchedAction {
  type: typeof VideoAction.VIDEOS_FETCHED;
  videos: VideosState;
}

export interface SelectVideoAction {
  type: typeof VideoAction.VIDEOS_SELECTED;
  video: Video;
}

export interface SelectNextVideoAction {
  type: typeof VideoAction.VIDEOS_SELECTED_NEXT;
}

export interface SelectPreviousVideoAction {
  type: typeof VideoAction.VIDEOS_SELECTED_PREVIOUS;
}

export interface NewVideoAlbumSelected {
  type: typeof VideoAction.NEW_VIDEO_ALBUM_SELECTED;
  albums: Album[];
}

export interface InitStateAction {
  type: typeof VideoAction.INIT_VIDEOS_STATE;
}

export interface SelectVideoForReading {
  type: typeof VideoAction.SELECT_VIDEO_FOR_READING;
  video: Video;
}

export interface NewOrUpdateVideoFromSocketSagaAction {
  type: typeof VideoAction.NEW_OR_UPDATE_VIDEO_FROM_SOCKET_SAGA;
  videoId: string;
}

export interface AddVideoToReducerAction {
  type: typeof VideoAction.ADD_VIDEO_TO_REDUCER;
  video: Video;
}

export type VideoActionTypes =
  | StartVideossFetchedAction
  | VideosFetchedAction
  | SelectVideoAction
  | SelectNextVideoAction
  | SelectPreviousVideoAction
  | NewVideoAlbumSelected
  | InitStateAction
  | SelectVideoForReading
  | NewOrUpdateVideoFromSocketSagaAction
  | AddVideoToReducerAction;
