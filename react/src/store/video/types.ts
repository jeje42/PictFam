import { Video } from '../../types/Video'
import { Album } from '../../types/Album'

export const START_VIDEOS_FETCHED = 'START_VIDEOS_FETCHED'
export const VIDEOS_FETCHED = 'VIDEOS_FETCHED'
export const VIDEOS_SELECTED = 'VIDEOS_SELECTED'
export const VIDEOS_SELECTED_NEXT = 'VIDEOS_SELECTED_NEXT'
export const VIDEOS_SELECTED_PREVIOUS = 'VIDEOS_SELECTED_PREVIOUS'
export const NEW_ALBUM_SELECTED = 'NEW_ALBUM_SELECTED'
export const INIT_VIDEOS_STATE = 'INIT_VIDEOS_STATE'

export interface VideosState {
  videos: Array<Video>,
  videosSelected: Array<Video>
}

interface StartPhotosFetchedAction {
  type: typeof START_VIDEOS_FETCHED
  token: string
}

interface PhotosFetchedAction {
  type: typeof VIDEOS_FETCHED
  videos: VideosState
}

interface SelectPhotoAction {
  type: typeof VIDEOS_SELECTED
  video: Video
}

interface SelectNextPhotoAction {
  type: typeof VIDEOS_SELECTED_NEXT
}

interface SelectPreviousPhotoAction {
  type: typeof VIDEOS_SELECTED_PREVIOUS
}

interface NewAlbumSelected {
  type: typeof NEW_ALBUM_SELECTED,
  albums: Array<Album>
}

interface InitStateAction {
  type: typeof INIT_VIDEOS_STATE
}

export type VideoActionTypes = StartPhotosFetchedAction | PhotosFetchedAction | SelectPhotoAction | SelectNextPhotoAction | SelectPreviousPhotoAction | NewAlbumSelected | InitStateAction
