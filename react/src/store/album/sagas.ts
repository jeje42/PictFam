import {call, put, takeLatest} from 'redux-saga/effects'
import {AxiosRequestConfig} from "axios";
import {axiosInstance} from "../../rest/methods";
import {Album} from "../../types/Album";
import {
    ALBUM_IMAGE_FETCHED,
    ALBUM_VIDEO_FETCHED,
    AlbumActionTypes,
    START_ALBUM_IMAGE_FETCHED,
    START_ALBUM_VIDEO_FETCHED
} from "./types";

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

function* tryToFetchAlbumsImage(action: AlbumActionTypes) {
    if(action.type !== START_ALBUM_IMAGE_FETCHED) {
        return
    }

    const optionsToken = requestOption(action.token)
    const options: AxiosRequestConfig = {
        ...optionsToken,
        params: {
            albumType: 'image'
        }
    }

    const response: Response = yield call(getAlbums, options)

    yield put({
        type: ALBUM_IMAGE_FETCHED,
        albums: response.data
    })
}

function* tryToFetchAlbumsVideo(action: AlbumActionTypes) {
    if(action.type !== START_ALBUM_VIDEO_FETCHED) {
        return
    }

    const optionsToken = requestOption(action.token)
    const options: AxiosRequestConfig = {
        ...optionsToken,
        params: {
            albumType: 'video'
        }
    }

    const response: Response = yield call(getAlbums, options)

    yield put({
        type: ALBUM_VIDEO_FETCHED,
        albums: response.data
    })
}

export function* watchTryFetchAlbumsImage() {
    yield takeLatest(START_ALBUM_IMAGE_FETCHED, tryToFetchAlbumsImage)
}

export function* watchTryFetchAlbumsVideo() {
    yield takeLatest(START_ALBUM_VIDEO_FETCHED, tryToFetchAlbumsVideo)
}
