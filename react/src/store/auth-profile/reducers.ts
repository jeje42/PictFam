import {AuthActionTypes, AuthState, DONE_LOGIN, LOGOUT, SET_LOGIN_HAS_FAILED, START_LOGIN} from './types'

export const tokenLocalStorage = 'tokenLocalStorage'

const isTokenEmpty = (token: string | null) => {
    if (token === null || token === '') {
        return true
    }

    return false
}

const initialState: AuthState = {
    token: !isTokenEmpty(localStorage.getItem(tokenLocalStorage)) ? localStorage.getItem(tokenLocalStorage) as string : '',
    isAuthenticated: !isTokenEmpty(localStorage.getItem(tokenLocalStorage)),
    loginHasFailed: false
}

export function authReducer (
    state = initialState,
    action: AuthActionTypes
): AuthState {
    switch (action.type) {
        case START_LOGIN:
            return {
                ...state
            }
        case DONE_LOGIN:
            localStorage.setItem(tokenLocalStorage, action.token)
            return {
                ...state,
                token: action.token,
                isAuthenticated: true,
                loginHasFailed: false,
            }
        case SET_LOGIN_HAS_FAILED:
            return {
                ...state,
                loginHasFailed: true
            }
        case LOGOUT:
            localStorage.setItem(tokenLocalStorage, '')
            return {
                token: '',
                isAuthenticated: false,
                loginHasFailed: false
            }
        default:
            return state
    }
}