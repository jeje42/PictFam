import {call, put, takeLatest, takeEvery} from 'redux-saga/effects'
import {AuthActionTypes, DONE_LOGIN, LoginObject, LOGOUT, SET_LOGIN_HAS_FAILED, START_LOGIN} from './types'
import {axiosInstance} from '../../rest/methods'
import {AxiosRequestConfig} from 'axios'
import {INIT_ALBUMSTATE} from "../album/types";
import {INIT_PHOTOS_STATE} from "../photo/types";
import {INIT_DRAWERSTATE} from "../drawer/types";

interface Response {
    data: {
        accessToken: string,
        tokenType: string
    },
    status: 200,
}

const requestOption: AxiosRequestConfig = {
    headers: {
        'Content-Type': 'application/json'
    },
}

const postLogin = (data: any, options: AxiosRequestConfig) => axiosInstance.post('/api/auth/signin', data,  options)

function* tryToLoginSaga(action: AuthActionTypes) {
    if(action.type !== START_LOGIN) {
        return
    }

    debugger

    let response: Response
    try {
        response = yield call(postLogin, {
            'usernameOrEmail': action.loginObject.userNameOrEmail,
            'password': action.loginObject.password
        }, requestOption)
    } catch (e)
    {
        response = e.response
    }

    if (200 !== response.status
    || response.data === undefined
    || response.data.accessToken === undefined) {
        yield put({
            type: SET_LOGIN_HAS_FAILED,
            value: false
        })
    } else {
        yield put({
            type: DONE_LOGIN,
            token: response.data.accessToken
        })
    }
}

function* logoutSaga(action: AuthActionTypes) {
    const states = [INIT_ALBUMSTATE, INIT_PHOTOS_STATE, INIT_DRAWERSTATE]

    for (let i=0; i<states.length ; i++) {
        yield put({
            type: states[i]
        })
    }
}

export function* watchTryLogin() {
    yield takeLatest(START_LOGIN, tryToLoginSaga)
}

export function* watchLogout() {
    yield takeEvery(LOGOUT, logoutSaga)
}