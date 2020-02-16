import {AppActionTypes, AppState, CHANGE_MODULE, Module} from './types'

const initialState: AppState = {
  module: Module.Image

}

export function appReducer (
  state = initialState,
  action: AppActionTypes
): AppState {
  switch (action.type) {
    case CHANGE_MODULE:
      return {
        ...state,
        module: action.module
      }
    default:
      return state
  }
}
