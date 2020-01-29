import {call, put, takeLatest} from 'redux-saga/effects'
import {AuthActionTypes, DONE_LOGIN, LoginObject, START_LOGIN} from './types'
import {axiosInstance} from '../../rest/methods'
import {AxiosRequestConfig} from 'axios'

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

    const response: Response = yield call(postLogin, {
        'usernameOrEmail': action.loginObject.userNameOrEmail,
        'password': action.loginObject.password
    }, requestOption)

    if (200 !== response.status
    || response.data === undefined
    || response.data.accessToken === undefined) {
        alert('Something went wrong!')
        return
    }

    yield put({
        type: DONE_LOGIN,
        token: response.data.accessToken
    })
}

export function* watchTryLogin() {
    yield takeLatest(START_LOGIN, tryToLoginSaga)
}