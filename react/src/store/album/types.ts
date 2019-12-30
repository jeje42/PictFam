import { Album } from '../../types/Album'

export const ALBUM_ADDED = 'ALBUM_ADDED'
export const ALBUM_SELECTED = 'ALBUM_SELECTED'

export interface AlbumState {
  albums: Album[]
}

interface AddAlbumAction {
  type: typeof ALBUM_ADDED
  albums: Album[]
}

interface SelectAlbumAction {
  type: typeof ALBUM_SELECTED
  album: Album
}

export type AlbumActionTypes = AddAlbumAction | SelectAlbumAction
