import { AddAlbumToReducer, AlbumAction, AlbumMediaType, FetchAlbumsFromRootSagaAction, NewAlbumFromSocketSagaAction, SelectAlbumAction } from './types';
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

export const addAlbumToReducer = (album: Album, albumMediaType: AlbumMediaType): AddAlbumToReducer => ({
  type: AlbumAction.ADD_ALBUM_TO_REDUCER,
  album,
  albumMediaType,
});

export const newAlbumFromSocketSagaAction = (albumId: string): NewAlbumFromSocketSagaAction => ({
  type: AlbumAction.NEW_ALBUM_FROM_SOCKET_SAGA,
  albumId,
});
