import {DONE_LOGIN, LoginObject, LOGOUT, SET_LOGIN_HAS_FAILED, START_LOGIN, START_SCAN} from "./types";

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

export function startScanAction(token: string) {
    return {
        type: START_SCAN,
        token: token
    }
}

export function logoutAction() {
    return {
        type: LOGOUT
    }
}