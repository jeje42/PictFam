import { AlbumState, AlbumActionTypes, ALBUM_ADDED, ALBUM_SELECTED } from './types'
import { Album } from '../../types/Album'

const initialState: AlbumState = {
  albums: []
}

const albumSelected = (state: AlbumState, newPhotoSelected: Album) => {
  return {
    ...state,
    albums: state.albums.map(photo => {
      return photo
    })
  }
}

export function AlbumsReducer (
  state = initialState,
  action: AlbumActionTypes
): AlbumState {
  switch (action.type) {
    case ALBUM_ADDED:
      return {
        ...state,
        ...action.album
      }
    case ALBUM_SELECTED:
      return albumSelected(state, action.album)
    default:
      return state
  }
}
