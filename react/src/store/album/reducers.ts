import { AddAlbumToReducer, AlbumAction, AlbumActionTypes, AlbumMediaType, AlbumState, SelectAlbumAction, UpdateAlbumToReducer } from './types';

const initialState: AlbumState = {
  imageAlbumsRecord: {},
  imageParentAlbumsRecord: {},
  albumImageIdSelected: -1,
  videoAlbumsRecord: {},
  videoParentAlbumsRecord: {},
  albumVideoIdSelected: -1,
};

const albumSelected = (state: AlbumState, action: SelectAlbumAction) => {
  const selectedAttributeName = action.albumMediaType === AlbumMediaType.Image ? 'albumImageIdSelected' : 'albumVideoIdSelected';
  return {
    ...state,
    [selectedAttributeName]: action.albumId,
  };
};

const updateAlbumInReducer = (state: AlbumState, action: UpdateAlbumToReducer): AlbumState => {
  const recordAttributeName = action.albumMediaType === AlbumMediaType.Image ? 'imageAlbumsRecord' : 'videoAlbumsRecord';
  const parentRecordAttributeName = action.albumMediaType === AlbumMediaType.Image ? 'imageParentAlbumsRecord' : 'videoParentAlbumsRecord';

  return {
    ...state,
    [recordAttributeName]: {
      ...state[recordAttributeName],
      [action.album.id]: action.album,
    },
    [parentRecordAttributeName]: {
      ...state[parentRecordAttributeName],
      [action.album.parentId]: state[parentRecordAttributeName][action.album.parentId].map(a => (a.id === action.album.id ? action.album : a)),
    },
  };
};

const addAlbumToReducer = (state: AlbumState, action: AddAlbumToReducer): AlbumState => {
  const recordAttributeName = action.albumMediaType === AlbumMediaType.Image ? 'imageAlbumsRecord' : 'videoAlbumsRecord';
  if (state[recordAttributeName][action.album.id]) {
    return updateAlbumInReducer(state, {
      type: AlbumAction.UPDATE_ALBUM_TO_REDUCER,
      albumMediaType: action.albumMediaType,
      album: action.album,
    });
  }

  const parentRecordAttributeName = action.albumMediaType === AlbumMediaType.Image ? 'imageParentAlbumsRecord' : 'videoParentAlbumsRecord';

  return {
    ...state,
    [recordAttributeName]: {
      ...state[recordAttributeName],
      [action.album.id]: action.album,
    },
    [parentRecordAttributeName]: {
      ...state[parentRecordAttributeName],
      [action.album.parentId]: state[parentRecordAttributeName][action.album.parentId]
        ? [...state[parentRecordAttributeName][action.album.parentId], action.album]
        : [action.album],
    },
  };
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
