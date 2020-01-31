import {DONE_LOGIN, LoginObject, LOGOUT, SET_LOGIN_HAS_FAILED, START_LOGIN} from "./types";

export function startLogin(loginObject: LoginObject) {
    return {
        type: START_LOGIN,
        loginObject: loginObject
    }
}

export function doneLogin(token: string) {
    return {
        type: DONE_LOGIN,
        token: token
    }
}

export function setLoginHasFailed(value: boolean) {
    return {
        type: SET_LOGIN_HAS_FAILED,
        value: value
    }
}

export function logoutAction() {
    return {
        type: LOGOUT
    }
}