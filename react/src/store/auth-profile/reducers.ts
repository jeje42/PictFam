import {AuthActionTypes, AuthState, DONE_LOGIN, START_LOGIN} from './types'

const initialState: AuthState = {
    token: '',
    isAuthenticated: false
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
            debugger
            return {
                ...state,
                token: action.token,
                isAuthenticated: true,
            }
        default:
            return state
    }
}