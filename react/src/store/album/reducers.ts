import { AlbumState, AlbumActionTypes, ALBUM_ADDED, ALBUM_SELECTED } from './types'
import { Album } from '../../types/Album'

const initialState: AlbumState = {
  albums: []
}

const albumSelected = (state: AlbumState, newAlbumSelected: Album) => {
  return {
    ...state,
    albums: state.albums.map(photo => {
      return photo
    })
  }
}

export function albumsReducer (
  state = initialState,
  action: AlbumActionTypes
): AlbumState {
  switch (action.type) {
    case ALBUM_ADDED:
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
