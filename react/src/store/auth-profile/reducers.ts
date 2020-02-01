import {AuthActionTypes, AuthState, DONE_LOGIN, LOGOUT, SET_LOGIN_HAS_FAILED, START_LOGIN} from './types'

export const tokenLocalStorage = 'tokenLocalStorage'
export const tokenExpirationDateLocalStorage = 'tokenExpirationDateLocalStorage'

const jwtExpirationTimeMS = 1800000

const isEmpty = (token: string | null) => {
    if (token === null || token === '') {
        return true
    }

    return false
}

const initialState: AuthState = {
    token: !isEmpty(localStorage.getItem(tokenLocalStorage)) ? localStorage.getItem(tokenLocalStorage) as string : '',
    isAuthenticated: !isEmpty(localStorage.getItem(tokenLocalStorage)),
    loginHasFailed: false,
    expirationDate: isEmpty(localStorage.getItem(tokenExpirationDateLocalStorage)) ? undefined : new Date(localStorage.getItem(tokenExpirationDateLocalStorage)!),
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
            let expirationDate = new Date(Date.now() + jwtExpirationTimeMS)
            localStorage.setItem(tokenExpirationDateLocalStorage, expirationDate.toString())
            return {
                ...state,
                token: action.token,
                isAuthenticated: true,
                loginHasFailed: false,
                expirationDate: expirationDate,
            }
        case SET_LOGIN_HAS_FAILED:
            return {
                ...state,
                loginHasFailed: true
            }
        case LOGOUT:
            localStorage.setItem(tokenLocalStorage, '')
            localStorage.setItem(tokenExpirationDateLocalStorage, '')
            return {
                token: '',
                isAuthenticated: false,
                loginHasFailed: false,
                expirationDate: undefined,
            }
        default:
            return state
    }
}