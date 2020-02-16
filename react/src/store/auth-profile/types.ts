import {User} from "../../types/User";

export const START_LOGIN = 'START_LOGIN'
export const DONE_LOGIN = 'DONE_LOGIN'
export const SET_USER_DETAILS = 'SET_USER_DETAILS'
export const SET_LOGIN_HAS_FAILED = 'SET_LOGIN_HAS_FAILED'
export const START_SCAN = 'START_SCAN'
export const LOGOUT = 'LOGOUT'

export interface LoginObject {
  userNameOrEmail: string,
  password: string
}

interface StartLoginAction {
  type: typeof START_LOGIN,
  loginObject: LoginObject
}

interface DoneLoginAction {
  type: typeof DONE_LOGIN,
  token: string
}

interface SetUserNameAction {
  type: typeof SET_USER_DETAILS,
  userDetails: User
}

interface LoginHasFailed {
  type: typeof SET_LOGIN_HAS_FAILED,
  value: boolean
}

interface StartScanAction {
  type: typeof START_SCAN,
  token: string
  scanType: string
}

interface LogoutAction {
  type: typeof LOGOUT
}

export type AuthActionTypes = StartLoginAction | DoneLoginAction | SetUserNameAction | LoginHasFailed | StartScanAction | LogoutAction