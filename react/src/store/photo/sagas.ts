import {call, put, takeLatest} from 'redux-saga/effects'
import {AxiosRequestConfig} from "axios";
import {PhotoActionTypes, START_PHOTOS_FETCHED, PHOTOS_FETCHED, PhotosState} from "./types";
import {axiosInstance} from "../../rest/methods";
import {Album} from "../../types/Album";
import {Photo} from "../../types/Photo";

interface PhotoResponse {
    id: number,
    name: string,
    album: Album
}

interface Response {
    data: PhotoResponse[]
}

const requestOption = (token: string): AxiosRequestConfig => {
    return {
        headers: {
            'Authorization': 'Bearer ' + token
        },
    }
}

const getPhotos = (options: AxiosRequestConfig) => axiosInstance.get('/photostree', options)

function* tryToFetchPhotos(action: PhotoActionTypes) {
    if(action.type !== START_PHOTOS_FETCHED) {
        return
    }

    const response: Response = yield call(getPhotos, requestOption(action.token))

    const newPhotosState: PhotosState = {
        photos: response.data.map((value: PhotoResponse) => {
            return {
                id:value.id,
                name: value.name,
                selected: false,
                album: value.album
            } as Photo
        }),
        photosSelected: []
    }

    yield put({
        type: PHOTOS_FETCHED,
        photos: newPhotosState
    })
}

export function* watchTryFetchPhotos() {
    yield takeLatest(START_PHOTOS_FETCHED, tryToFetchPhotos)
}