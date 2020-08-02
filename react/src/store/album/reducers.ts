import { AddAlbumToReducer, AlbumAction, AlbumActionTypes, AlbumMediaType, AlbumState, SelectAlbumAction } from './types';

const initialState: AlbumState = {
  imageAlbumsTree: [],
  imageAlbumsRecord: {},
  albumImageIdSelected: -1,
  videoAlbumsTree: [],
  videoAlbumsRecord: {},
  albumVideoIdSelected: -1,
};

const albumSelected = (state: AlbumState, action: SelectAlbumAction) => {
  const selectedAttributeName = action.albumMediaType === AlbumMediaType.Image ? 'albumImageIdSelected' : 'albumVideoIdSelected';
  return {
    ...state,
    [selectedAttributeName]: action.albumId,
  };
};

const addAlbumToReducer = (state: AlbumState, action: AddAlbumToReducer): AlbumState => {
  const recordAttributeName = action.albumMediaType === AlbumMediaType.Image ? 'imageAlbumsRecord' : 'videoAlbumsRecord';
  const treeAttributeName = action.albumMediaType === AlbumMediaType.Image ? 'imageAlbumsTree' : 'videoAlbumsTree';

  const parentExists = action.parentId ? state[recordAttributeName][action.parentId] : undefined;

  const toReturn = {
    ...state,
    [recordAttributeName]: {
      ...state[recordAttributeName],
      [action.album.id]: action.album,
    },
  };

  if (parentExists) {
    parentExists.sons = [...parentExists.sons, action.album];
  } else {
    toReturn[treeAttributeName] = [...toReturn[treeAttributeName], action.album];
  }

  return toReturn;
};

export function albumsReducer(state = initialState, action: AlbumActionTypes): AlbumState {
  switch (action.type) {
    case AlbumAction.SELECT_ALBUM:
      return albumSelected(state, action);
    case AlbumAction.ADD_ALBUM_TO_REDUCER:
      return addAlbumToReducer(state, action);
    case AlbumAction.INIT_ALBUMSTATE:
      return initialState;
    default:
      return state;
  }
}
