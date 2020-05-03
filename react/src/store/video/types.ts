import { Video } from '../../types/Video';
import { Album } from '../../types/Album';
import { ActionRequest } from '../types';

export const START_VIDEOS_FETCHED = 'START_VIDEOS_FETCHED';
export const VIDEOS_FETCHED = 'VIDEOS_FETCHED';
export const VIDEOS_SELECTED = 'VIDEOS_SELECTED';
export const VIDEOS_SELECTED_NEXT = 'VIDEOS_SELECTED_NEXT';
export const VIDEOS_SELECTED_PREVIOUS = 'VIDEOS_SELECTED_PREVIOUS';
export const NEW_ALBUM_VIDEO_SELECTED = 'NEW_ALBUM_VIDEO_SELECTED';
export const INIT_VIDEOS_STATE = 'INIT_VIDEOS_STATE';
export const SELECT_VIDEO_FOR_READING = 'SELECT_VIDEO_FOR_READING';

export interface VideosState {
  videos: Video[];
  videosSelected: Video[];
  videoReading?: Video;
}

export interface StartVideossFetchedAction extends ActionRequest {
  type: typeof START_VIDEOS_FETCHED;
}

interface VideosFetchedAction {
  type: typeof VIDEOS_FETCHED;
  videos: VideosState;
}

interface SelectVideoAction {
  type: typeof VIDEOS_SELECTED;
  video: Video;
}

interface SelectNextVideoAction {
  type: typeof VIDEOS_SELECTED_NEXT;
}

interface SelectPreviousVideoAction {
  type: typeof VIDEOS_SELECTED_PREVIOUS;
}

interface NewAlbumSelected {
  type: typeof NEW_ALBUM_VIDEO_SELECTED;
  albums: Album[];
}

interface InitStateAction {
  type: typeof INIT_VIDEOS_STATE;
}

export interface SelectVideoForReading {
  type: typeof SELECT_VIDEO_FOR_READING;
  video: Video;
}

export type VideoActionTypes =
  | StartVideossFetchedAction
  | VideosFetchedAction
  | SelectVideoAction
  | SelectNextVideoAction
  | SelectPreviousVideoAction
  | NewAlbumSelected
  | InitStateAction
  | SelectVideoForReading;
