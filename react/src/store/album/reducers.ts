import { ALBUM_IMAGE_FETCHED, ALBUM_IMAGE_SELECTED, ALBUM_VIDEO_FETCHED, ALBUM_VIDEO_SELECTED, AlbumActionTypes, AlbumState, INIT_ALBUMSTATE } from './types';

const initialState: AlbumState = {
  albumsImage: [],
  albumImageIdSelected: -1,
  albumsVideo: [],
  albumVideoIdSelected: -1,
};

const albumImageSelected = (state: AlbumState, albumId: number) => {
  return {
    ...state,
    albumImageIdSelected: albumId,
  };
};

const albumVideoSelected = (state: AlbumState, albumId: number) => {
  return {
    ...state,
    albumVideoIdSelected: albumId,
  };
};
export function albumsReducer(state = initialState, action: AlbumActionTypes): AlbumState {
  switch (action.type) {
    case ALBUM_IMAGE_FETCHED:
      return {
        ...state,
        albumsImage: action.albums,
      };
    case ALBUM_VIDEO_FETCHED:
      return {
        ...state,
        albumsVideo: action.albums,
      };
    case ALBUM_IMAGE_SELECTED:
      return albumImageSelected(state, action.albumId);
    case ALBUM_VIDEO_SELECTED:
      return albumVideoSelected(state, action.albumId);
    case INIT_ALBUMSTATE:
      return initialState;
    default:
      return state;
  }
}
