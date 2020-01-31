export const START_LOGIN = 'START_LOGIN'
export const DONE_LOGIN = 'DONE_LOGIN'
export const SET_LOGIN_HAS_FAILED = 'SET_LOGIN_HAS_FAILED'
export const LOGOUT = 'LOGOUT'

export interface LoginObject {
  userNameOrEmail: string,
  password: string
}

export interface AuthState {
  token: string,
  isAuthenticated: boolean,
  loginHasFailed: boolean,
}

interface StartLoginAction {
  type: typeof START_LOGIN,
  loginObject: LoginObject
}

interface DoneLoginAction {
  type: typeof DONE_LOGIN,
  token: string
}

interface LoginHasFailed {
  type: typeof SET_LOGIN_HAS_FAILED,
  value: boolean
}

interface LogoutAction {
  type: typeof  LOGOUT
}

export type AuthActionTypes = StartLoginAction | DoneLoginAction | LoginHasFailed | LogoutAction