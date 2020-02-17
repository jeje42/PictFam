import { DONE_LOGIN, LoginObject, LOGOUT, SET_LOGIN_HAS_FAILED, START_LOGIN, START_SCAN, StartScanAction } from './types';

export function startLogin(loginObject: LoginObject) {
  return {
    type: START_LOGIN,
    loginObject,
  };
}

export function doneLogin(token: string) {
  return {
    type: DONE_LOGIN,
    token,
  };
}

export function setLoginHasFailed(value: boolean) {
  return {
    type: SET_LOGIN_HAS_FAILED,
    value,
  };
}

export function startScanAction(scanType: string): StartScanAction {
  return {
    type: START_SCAN,
    scanType,
    request: {
      method: 'get',
      url: '/scanFiles',
    },
  };
}

export function logoutAction() {
  return {
    type: LOGOUT,
  };
}
