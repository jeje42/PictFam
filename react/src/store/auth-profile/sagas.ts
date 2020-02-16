import {call, put, takeEvery, takeLatest} from 'redux-saga/effects'
import {
    AuthActionTypes,
    DONE_LOGIN,
    LOGOUT,
    SET_LOGIN_HAS_FAILED,
    SET_USER_DETAILS,
    START_LOGIN,
    START_SCAN
} from './types'
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

const requestOptionGet = (token: string): AxiosRequestConfig => {
    return {
        headers: {
            'Authorization': 'Bearer ' + token
        },
    }
}

const postLogin = (data: any, options: AxiosRequestConfig) => axiosInstance.post('/api/auth/signin', data,  options)

const getUserName = (options: AxiosRequestConfig) => axiosInstance.get('/userdetails', options)

const getStartScan = (options: AxiosRequestConfig) => axiosInstance.get('/scanFiles', options)

function* tryToLoginSaga(action: AuthActionTypes) {
    if(action.type !== START_LOGIN) {
        return
    }

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

        const responseUserName: Response = yield call(getUserName, requestOptionGet(response.data.accessToken))
        
        yield put({
            type: SET_USER_DETAILS,
            userDetails: responseUserName.data
        })
    }
}

function* startScanSaga(action: AuthActionTypes) {
    if (action.type !== START_SCAN) {
        return
    }
    
    const optionsScan = requestOptionGet(action.token)

    const response: Response = yield call(getStartScan, {
        ...optionsScan,
        params: {
            scanType: action.scanType
        }
    })
    
    if (response.status === 200) {
        alert("Scan has begun!")
    } else {
        alert("Problem! Scan not started!")
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

export function* watchStartScan() {
    yield takeEvery(START_SCAN, startScanSaga)
}

export function* watchLogout() {
    yield takeEvery(LOGOUT, logoutSaga)
}