import { all, put, select, takeLatest } from 'redux-saga/effects';
import axios, { AxiosRequestConfig } from 'axios';
import { AlbumFetched } from '../../types/Album';
import { AlbumAction, AlbumActionTypes, AlbumMediaType } from './types';
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

export function* watchFetchAlbumsFromRoot(): Generator {
  yield takeLatest(AlbumAction.FETCH_ALBUMS_FROM_ROOT_SAGA, fetchAlbumsFromRoot);
}
