import {call, put, takeLatest} from 'redux-saga/effects'
import {AxiosRequestConfig} from "axios";
import {VideoActionTypes, START_VIDEOS_FETCHED, VIDEOS_FETCHED, VideosState} from "./types";
import {axiosInstance} from "../../rest/methods";
import {Album} from "../../types/Album";
import {Video} from "../../types/Video";

interface VideoResponse {
    id: number,
    name: string,
    album: Album
}

interface Response {
    data: VideoResponse[]
}

const requestOption = (token: string): AxiosRequestConfig => {
    return {
        headers: {
            'Authorization': 'Bearer ' + token
        },
    }
}

const getVideos = (options: AxiosRequestConfig) => axiosInstance.get('/photostree', options)

function* tryToFetchVideos(action: VideoActionTypes) {
    if(action.type !== START_VIDEOS_FETCHED) {
        return
    }

    const optionsToken = requestOption(action.token)
    const options: AxiosRequestConfig = {
        ...optionsToken,
        params: {
            dataType: 'video'
        }
    }

    const response: Response = yield call(getVideos, options)

    const newVideosState: VideosState = {
        videos: response.data.map((value: VideoResponse) => {
            return {
                id:value.id,
                name: value.name,
                selected: false,
                album: value.album
            } as Video
        }),
        videosSelected: []
    }
    
    yield put({
        type: VIDEOS_FETCHED,
        videos: newVideosState
    })
}

export function* watchTryFetchVideos() {
    yield takeLatest(START_VIDEOS_FETCHED, tryToFetchVideos)
}