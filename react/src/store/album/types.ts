import { Album } from '../../types/Album'

export const START_ALBUM_IMAGE_FETCHED = 'START_ALBUM_IMAGE_FETCHED'
export const ALBUM_IMAGE_FETCHED = 'ALBUM_IMAGE_FETCHED'
export const ALBUM_IMAGE_SELECTED = 'ALBUM_IMAGE_SELECTED'
export const START_ALBUM_VIDEO_FETCHED = 'START_ALBUM_VIDEO_FETCHED'
export const ALBUM_VIDEO_FETCHED = 'ALBUM_VIDEO_FETCHED'
export const ALBUM_VIDEO_SELECTED = 'ALBUM_VIDEO_SELECTED'
export const INIT_ALBUMSTATE = 'INIT_ALBUMSTATE'

export interface AlbumState {
  albumsImage: Album[],
  albumImageIdSelected: number
  albumsVideo: Album[],
  albumVideoIdSelected: number
}

export interface StartFetchAlbumsImageAction {
  type: typeof START_ALBUM_IMAGE_FETCHED,
  token: string
}

export interface AlbumImageFetchedAction {
  type: typeof ALBUM_IMAGE_FETCHED
  albums: Album[]
}

export interface SelectAlbumImageAction {
  type: typeof ALBUM_IMAGE_SELECTED
  album: Album
}

export interface StartFetchAlbumsVideoAction {
  type: typeof START_ALBUM_VIDEO_FETCHED,
  token: string
}

export interface AlbumVideoFetchedAction {
  type: typeof ALBUM_VIDEO_FETCHED
  albums: Album[]
}

export interface SelectAlbumVideoAction {
  type: typeof ALBUM_VIDEO_SELECTED
  album: Album
}

export interface InitAlbumStateAction {
  type: typeof INIT_ALBUMSTATE
}

export type AlbumActionTypes = StartFetchAlbumsImageAction | AlbumImageFetchedAction | SelectAlbumImageAction | InitAlbumStateAction | StartFetchAlbumsVideoAction | AlbumVideoFetchedAction |SelectAlbumVideoAction
