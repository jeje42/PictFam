import {AuthActionTypes, DONE_LOGIN, LOGOUT, SET_LOGIN_HAS_FAILED, SET_USERNAME, START_LOGIN} from './types'
import {createCheckers} from "ts-interface-checker";
import {AuthState as AuthStateOriginal} from "./stateInterface";
import authStateTi from './stateInterface-ti'

export const authReducerStorage = 'authReducerStorage'

const jwtExpirationTimeMS = 1800000

const isEmpty = (token: string | null) => {
    if (token === null || token === '') {
        return true
    }

    return false
}

const {AuthState} = createCheckers(authStateTi)

let initialState: AuthStateOriginal = {
    token: '',
    isAuthenticated: false,
    loginHasFailed: false,
    expirationDate: undefined,
    userName: '',
}


let restoredStringState = localStorage.getItem(authReducerStorage)
if (restoredStringState !== null) {
    let initialStateParsed = JSON.parse(restoredStringState)
    try {
        if (initialStateParsed.expirationDate) {
            initialStateParsed.expirationDate = new Date(Date.parse(initialStateParsed.expirationDate))
        }
        AuthState.check(initialStateParsed)
        initialState = initialStateParsed
    } catch (e) {
        console.error(e)
    }
}

function authReducerWrapped (
    state = initialState,
    action: AuthActionTypes
): AuthStateOriginal {
    switch (action.type) {
        case START_LOGIN:
            return {
                ...state
            }
        case DONE_LOGIN:
            return {
                ...state,
                token: action.token,
                isAuthenticated: true,
                loginHasFailed: false,
                expirationDate: new Date(Date.now() + jwtExpirationTimeMS),
            }

        case SET_USERNAME:
            return {
                ...state,
                userName: action.userName
            }
        case SET_LOGIN_HAS_FAILED:
            return {
                ...state,
                loginHasFailed: true
            }
        case LOGOUT:
            return {
                token: '',
                isAuthenticated: false,
                loginHasFailed: false,
                expirationDate: undefined,
                userName: '',
            }
        default:
            return state
    }
}

export function authReducer (
    state = initialState,
    action: AuthActionTypes
): AuthStateOriginal {
    let newState = authReducerWrapped(state, action)
    localStorage.setItem(authReducerStorage, JSON.stringify(newState))
    return newState
}