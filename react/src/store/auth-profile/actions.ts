import {DONE_LOGIN, LoginObject, LOGOUT, START_LOGIN} from "./types";

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

export function logoutAction() {
    return {
        type: LOGOUT
    }
}