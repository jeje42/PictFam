import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { AuthActionTypes, DONE_LOGIN, FETCH_ACTION, LOGOUT, SET_LOGIN_HAS_FAILED, SET_USER_DETAILS, START_LOGIN, START_SCAN } from './types';
import { AxiosRequestConfig } from 'axios';
import { INIT_DRAWERSTATE } from '../drawer/types';
import { getRequest, postRequest } from '../../utils/axiosUtils';
import { AppState } from '../index';
import { Module } from '../app/types';
import { startPhotosFetched } from '../photo/actions';
import { fetchAlbumsFromRootSagaAction } from '../album';
import { startVideosFetched } from '../video/actions';
import { startFetchAllPlaylists } from '../playlist/actions';
import { PLAYLIST_ACTION } from '../playlist/types';
import { AlbumAction, AlbumMediaType } from '../album/types';
import { PhotoAction } from '../photo/types';
import { VideoAction } from '../video/types';
import { pushMessageAction } from '../feedback';

interface Response {
  data: {
    accessToken: string;
    tokenType: string;
  };
  status: 200;
}

const requestOptionGet = (token: string): AxiosRequestConfig => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

function* tryToLoginSaga(action: AuthActionTypes) {
  if (action.type !== START_LOGIN) {
    return;
  }

  let response: Response;
  const requestOption: AxiosRequestConfig = {
    method: 'post',
    url: `/api/auth/signin`,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    response = yield call(
      postRequest,
      {
        usernameOrEmail: action.loginObject.userNameOrEmail,
        password: action.loginObject.password,
      },
      requestOption,
    );
  } catch (e) {
    response = e.response;
  }

  if (200 !== response.status || response.data === undefined || response.data.accessToken === undefined) {
    yield put({
      type: SET_LOGIN_HAS_FAILED,
      value: false,
    });
  } else {
    yield put({
      type: DONE_LOGIN,
      token: response.data.accessToken,
    });

    const finalOptions: AxiosRequestConfig = {
      ...requestOptionGet(response.data.accessToken),
      url: '/userdetails',
      method: 'get',
    };
    const responseUserName: Response = yield call(getRequest, finalOptions);

    yield put({
      type: SET_USER_DETAILS,
      userDetails: responseUserName.data,
    });
  }
}

function* startScanSaga(action: AuthActionTypes) {
  if (action.type !== START_SCAN) {
    return;
  }

  const response: Response = yield call(getRequest, {
    ...action.request,
    params: {
      scanType: action.scanType,
    },
  });

  if (response.status === 200) {
    yield put(pushMessageAction({ message: 'Scan has begun!', severity: 'success' }));
  } else {
    yield put(pushMessageAction({ message: 'Problem! Scan not started!', severity: 'error' }));
  }
}

function* startFetchSaga() {
  const state: AppState = yield select();

  if (state.auth.isAuthenticated) {
    switch (state.app.module) {
      case Module.Image:
        if (state.albums.imageAlbumsTree.length === 0) {
          yield put(startPhotosFetched());
          yield put(fetchAlbumsFromRootSagaAction(AlbumMediaType.Image));
        }
        break;
      case Module.Video:
        if (state.albums.videoAlbumsTree.length === 0) {
          yield put(fetchAlbumsFromRootSagaAction(AlbumMediaType.Video));
          yield put(startVideosFetched());
          yield put(startFetchAllPlaylists());
        }
        break;
    }
  }
}

function* logoutSaga() {
  const states = [
    AlbumAction.INIT_ALBUMSTATE,
    PhotoAction.INIT_PHOTOS_STATE,
    INIT_DRAWERSTATE,
    PLAYLIST_ACTION.INIT_PLAYLIST_STATE,
    VideoAction.INIT_VIDEOS_STATE,
  ];

  for (let i = 0; i < states.length; i++) {
    yield put({
      type: states[i],
    });
  }
}

export function* watchTryLogin(): Generator {
  yield takeLatest(START_LOGIN, tryToLoginSaga);
}

export function* watchStartScan(): Generator {
  yield takeEvery(START_SCAN, startScanSaga);
}

export function* watchLogout(): Generator {
  yield takeEvery(LOGOUT, logoutSaga);
}

export function* watchFetchAll(): Generator {
  yield takeEvery(FETCH_ACTION, startFetchSaga);
}
