import {ALBUM_FETCHED, ALBUM_SELECTED, AlbumActionTypes, AlbumState} from './types'
import {Album} from '../../types/Album'

const initialState: AlbumState = {
  albums: [],
  albumIdSelected: -1
}

const albumSelected = (state: AlbumState, newAlbumSelected: Album) => {
  return {
    ...state,
    albumIdSelected: newAlbumSelected.id
  }
}

export function albumsReducer (
  state = initialState,
  action: AlbumActionTypes
): AlbumState {
  switch (action.type) {
    case ALBUM_FETCHED:
      return {
        ...state,
        albums: action.albums
      }
    case ALBUM_SELECTED:
      return albumSelected(state, action.album)
    default:
      return state
  }
}
