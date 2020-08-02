import { AddAlbumToReducer, AlbumAction, AlbumMediaType, FetchAlbumsFromRootSagaAction, SelectAlbumAction } from './types';
import { Album } from '../../types/Album';

export const selectAlbum = (albumId: number, albumMediaType: AlbumMediaType): SelectAlbumAction => ({
  type: AlbumAction.SELECT_ALBUM,
  albumId,
  albumMediaType,
});

export const fetchAlbumsFromRootSagaAction = (albumMediaType: AlbumMediaType): FetchAlbumsFromRootSagaAction => ({
  type: AlbumAction.FETCH_ALBUMS_FROM_ROOT_SAGA,
  albumMediaType,
});

export const addAlbumToReducer = (album: Album, albumMediaType: AlbumMediaType, parentId?: number): AddAlbumToReducer => ({
  type: AlbumAction.ADD_ALBUM_TO_REDUCER,
  album,
  parentId,
  albumMediaType,
});
