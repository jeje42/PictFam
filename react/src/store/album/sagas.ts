import {call, put, takeLatest} from 'redux-saga/effects'
import {AxiosRequestConfig} from "axios";
import {axiosInstance} from "../../rest/methods";
import {Album} from "../../types/Album";
import {ALBUM_FETCHED, ALBUM_SELECTED, AlbumActionTypes, AlbumState, START_ALBUM_FETCHED} from "./types";


interface Response {
    data: Album[]
}

const requestOption = (token: string): AxiosRequestConfig => {
    return {
        headers: {
            'Authorization': 'Bearer ' + token
        },
    }
}

const getAlbums = (options: AxiosRequestConfig) => axiosInstance.get('/albumstree', options)

function* tryToFetchAlbums(action: AlbumActionTypes) {
    if(action.type !== START_ALBUM_FETCHED) {
        return
    }

    const response: Response = yield call(getAlbums, requestOption(action.token))

    yield put({
        type: ALBUM_FETCHED,
        albums: response.data
    })
}

export function* watchTryFetchAlbums() {
    yield takeLatest(START_ALBUM_FETCHED, tryToFetchAlbums)
}