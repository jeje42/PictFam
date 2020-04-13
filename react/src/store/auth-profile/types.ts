import { User } from '../../types/User';
import { ActionRequest } from '../types';

export const START_LOGIN = 'START_LOGIN';
export const DONE_LOGIN = 'DONE_LOGIN';
export const SET_USER_DETAILS = 'SET_USER_DETAILS';
export const SET_LOGIN_HAS_FAILED = 'SET_LOGIN_HAS_FAILED';
export const START_SCAN = 'START_SCAN';
export const LOGOUT = 'LOGOUT';
export const FETCH_ACTION = 'FETCH_ACTION';

export interface LoginObject {
  userNameOrEmail: string;
  password: string;
}

interface StartLoginAction {
  type: typeof START_LOGIN;
  loginObject: LoginObject;
}

interface DoneLoginAction {
  type: typeof DONE_LOGIN;
  token: string;
}

interface SetUserNameAction {
  type: typeof SET_USER_DETAILS;
  userDetails: User;
}

interface LoginHasFailed {
  type: typeof SET_LOGIN_HAS_FAILED;
  value: boolean;
}

export interface StartScanAction extends ActionRequest {
  type: typeof START_SCAN;
  scanType: string;
}

export interface StartFetchAction {
  type: typeof FETCH_ACTION;
}

interface LogoutAction {
  type: typeof LOGOUT;
}

export type AuthActionTypes = StartLoginAction | DoneLoginAction | SetUserNameAction | LoginHasFailed | StartScanAction | LogoutAction;
