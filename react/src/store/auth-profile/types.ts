export const START_LOGIN = 'START_LOGIN'
export const DONE_LOGIN = 'DONE_LOGIN'

export interface LoginObject {
  userNameOrEmail: string,
  password: string
}

export interface AuthState {
  token: string,
  isAuthenticated: boolean
}

interface StartLoginAction {
  type: typeof START_LOGIN,
  loginObject: LoginObject
}

interface DoneLoginAction {
  type: typeof DONE_LOGIN,
  token: string
}

export type AuthActionTypes = StartLoginAction | DoneLoginAction