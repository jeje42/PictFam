import { Album } from '../../types/Album'

export const START_ALBUM_FETCHED = 'START_ALBUM_FETCHED '
export const ALBUM_FETCHED = 'ALBUM_FETCHED '
export const ALBUM_SELECTED = 'ALBUM_SELECTED'

export interface AlbumState {
  albums: Album[],
  albumIdSelected: number
}

interface StartFetchAlbumsAction {
  type: typeof START_ALBUM_FETCHED,
  token: string
}

interface AlbumFetchedAction {
  type: typeof ALBUM_FETCHED
  albums: Album[]
}

interface SelectAlbumAction {
  type: typeof ALBUM_SELECTED
  album: Album
}

export type AlbumActionTypes = StartFetchAlbumsAction | AlbumFetchedAction | SelectAlbumAction
