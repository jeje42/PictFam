import { AuthActionTypes, DONE_LOGIN, LOGOUT, SET_LOGIN_HAS_FAILED, SET_USER_DETAILS, START_LOGIN } from './types';
import { AuthState as AuthStateOriginal } from './stateInterface';

export const authReducerStorage = 'authReducerStorage';

const jwtExpirationTimeMS = 1800000;

let initialState: AuthStateOriginal = {
  token: '',
  isAuthenticated: false,
  loginHasFailed: false,
  expirationDate: undefined,
  userDetails: undefined,
};

const restoredStringState = localStorage.getItem(authReducerStorage);
if (restoredStringState !== null) {
  const initialStateParsed = JSON.parse(restoredStringState);
  try {
    if (initialStateParsed.expirationDate) {
      initialStateParsed.expirationDate = new Date(Date.parse(initialStateParsed.expirationDate));
    }
    initialState = initialStateParsed;
  } catch (e) {
    console.error(e);
  }
}

function authReducerWrapped(state = initialState, action: AuthActionTypes): AuthStateOriginal {
  switch (action.type) {
    case START_LOGIN:
      return {
        ...state,
      };
    case DONE_LOGIN:
      return {
        ...state,
        token: action.token,
        isAuthenticated: true,
        loginHasFailed: false,
        expirationDate: new Date(Date.now() + jwtExpirationTimeMS),
      };

    case SET_USER_DETAILS:
      return {
        ...state,
        userDetails: action.userDetails,
      };
    case SET_LOGIN_HAS_FAILED:
      return {
        ...state,
        loginHasFailed: true,
      };
    case LOGOUT:
      return {
        token: '',
        isAuthenticated: false,
        loginHasFailed: false,
        expirationDate: undefined,
        userDetails: undefined,
      };
    default:
      return state;
  }
}

export function authReducer(state = initialState, action: AuthActionTypes): AuthStateOriginal {
  const newState = authReducerWrapped(state, action);
  localStorage.setItem(authReducerStorage, JSON.stringify(newState));
  return newState;
}
