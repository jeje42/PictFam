import { all, put, select, takeEvery } from 'redux-saga/effects';
import axios, { AxiosRequestConfig } from 'axios';
import { AlbumFetched } from '../../types/Album';
import { AlbumAction, AlbumActionTypes, AlbumMediaType, NewAlbumFromSocketSagaAction } from './types';
import { Endpoints } from '../../config/endpoints';
import { addAlbumToReducer } from './actions';
import { albumFetchedToAlbum } from './utils';

function* addAlbumsAndCallFetchSons(albumMediaType: AlbumMediaType, albums?: AlbumFetched[], parentId?: number): Generator {
  if (albums) {
    yield all(albums.map(album => put(addAlbumToReducer(albumFetchedToAlbum(album), albumMediaType, parentId))));

    yield all(albums.map(album => fetchSonAlbum(album._links.sons.href, albumMediaType, album.id)));
  }
}

function* fetchSonAlbum(url: string, albumMediaType: AlbumMediaType, parentId: number): Generator {
  const token = yield select(state => state.auth.token);

  const requestConfig: AxiosRequestConfig = {
    method: 'GET',
    url: url.substring(url.indexOf('/api')),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const r = yield axios(requestConfig);
  const response = r as { data: { _embedded: { albums: AlbumFetched[] } } };

  yield addAlbumsAndCallFetchSons(albumMediaType, response?.data?._embedded?.albums, parentId);
}

function* fetchAlbumsFromRoot(action: AlbumActionTypes): Generator {
  if (action.type !== AlbumAction.FETCH_ALBUMS_FROM_ROOT_SAGA) {
    return;
  }

  const { albumMediaType } = action;

  const token = yield select(state => state.auth.token);

  const requestConfig: AxiosRequestConfig = {
    method: 'GET',
    url: `${Endpoints.Albums}/search/${albumMediaType === AlbumMediaType.Image ? 'findAllRootForImage' : 'findAllRootForVideo'}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const r = yield axios(requestConfig);
  const response = r as { data: { _embedded: { albums: AlbumFetched[] } } };

  yield addAlbumsAndCallFetchSons(albumMediaType, response?.data?._embedded?.albums);
}

enum SocketHandling {
  FindRootFirst,
  JustFindFirstParent,
}

function* newAlbumFromSocketLogic(album: AlbumFetched, socketHandling: SocketHandling): Generator {
  const parentUrl = album._links.father.href;
  const token = yield select(state => state.auth.token);

  const requestForParentConfig: AxiosRequestConfig = {
    method: 'GET',
    url: `${parentUrl.substring(parentUrl.indexOf('/api'))}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const albumMediaType = album.forPhoto ? AlbumMediaType.Image : AlbumMediaType.Video;

  let r: unknown;
  try {
    r = yield axios(requestForParentConfig);
  } catch (e) {
    //404 not found for parent goes here
    //That means the album is a new root
    if (socketHandling === SocketHandling.FindRootFirst) {
      yield addAlbumsAndCallFetchSons(albumMediaType, [album]);
    } else {
      addAlbumToReducer(albumFetchedToAlbum(album), albumMediaType);
    }
    return;
  }

  const response = r as { data: AlbumFetched };

  if (socketHandling === SocketHandling.FindRootFirst) {
    yield newAlbumFromSocketLogic(response.data, SocketHandling.FindRootFirst);
  } else {
    const albumRecord: any = yield select(state => {
      return albumMediaType === AlbumMediaType.Image ? state.albums.imageAlbumsRecord : state.albums.videoAlbumsRecord;
    });

    if (albumRecord[response.data.id]) {
      addAlbumToReducer(albumFetchedToAlbum(response.data), albumMediaType, album.id);
    } else {
      //Parent is again not part of the reducer
      yield newAlbumFromSocketLogic(response.data, SocketHandling.FindRootFirst);
    }
  }
}

function* newAlbumFromSocketSaga(action: NewAlbumFromSocketSagaAction): Generator {
  const token = yield select(state => state.auth.token);

  const requestConfig: AxiosRequestConfig = {
    method: 'GET',
    url: `${Endpoints.Albums}/${action.albumId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const r = yield axios(requestConfig);
  const response = r as { data: AlbumFetched };

  yield newAlbumFromSocketLogic(response.data, SocketHandling.JustFindFirstParent);
}

export function* watchFetchAlbumsFromRoot(): Generator {
  yield takeEvery(AlbumAction.FETCH_ALBUMS_FROM_ROOT_SAGA, fetchAlbumsFromRoot);
}

export function* watchNewAlbumFromSocketSagaAction(): Generator {
  yield takeEvery(AlbumAction.NEW_ALBUM_FROM_SOCKET_SAGA, newAlbumFromSocketSaga);
}
