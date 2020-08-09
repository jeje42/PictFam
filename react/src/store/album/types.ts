import { Album } from '../../types/Album';

export enum AlbumAction {
  INIT_ALBUMSTATE = 'INIT_ALBUMSTATE',
  ADD_ALBUM_TO_REDUCER = 'ADD_ALBUM_TO_REDUCER',
  UPDATE_ALBUM_TO_REDUCER = 'UPDATE_ALBUM_TO_REDUCER',
  SELECT_ALBUM = 'SELECT_ALBUM',

  FETCH_ALBUMS_FROM_ROOT_SAGA = 'FETCH_ALBUMS_FROM_ROOT_SAGA',
  NEW_ALBUM_FROM_SOCKET_SAGA = 'NEW_ALBUM_FROM_SOCKET_SAGA',
}

export enum AlbumMediaType {
  Image,
  Video,
}

export interface AlbumState {
  imageAlbumsTree: Album[];
  imageAlbumsRecord: Record<number, Album>;
  albumImageIdSelected: number;
  videoAlbumsTree: Album[];
  videoAlbumsRecord: Record<number, Album>;
  albumVideoIdSelected: number;
}

export interface FetchAlbumsFromRootSagaAction {
  type: typeof AlbumAction.FETCH_ALBUMS_FROM_ROOT_SAGA;
  albumMediaType: AlbumMediaType;
}

export interface NewAlbumFromSocketSagaAction {
  type: typeof AlbumAction.NEW_ALBUM_FROM_SOCKET_SAGA;
  albumId: string;
}

export interface SelectAlbumAction {
  type: typeof AlbumAction.SELECT_ALBUM;
  albumId: number;
  albumMediaType: AlbumMediaType;
}

export interface AddAlbumToReducer {
  type: typeof AlbumAction.ADD_ALBUM_TO_REDUCER;
  albumMediaType: AlbumMediaType;
  album: Album;
  parentId?: number;
}

export interface UpdateAlbumToReducer {
  type: typeof AlbumAction.UPDATE_ALBUM_TO_REDUCER;
  albumMediaType: AlbumMediaType;
  album: Album;
}

export interface InitAlbumStateAction {
  type: typeof AlbumAction.INIT_ALBUMSTATE;
}

export type AlbumActionTypes =
  | FetchAlbumsFromRootSagaAction
  | SelectAlbumAction
  | InitAlbumStateAction
  | AddAlbumToReducer
  | NewAlbumFromSocketSagaAction
  | UpdateAlbumToReducer;
