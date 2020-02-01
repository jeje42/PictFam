import {DrawerState, DrawerActionTypes, DRAWER_TOGGLED, DRAWER_WIDTH_CHANGED, INIT_DRAWERSTATE} from './types'

const initialState: DrawerState = {
  open: true,
  width: 0
}

export function drawerReducer (
  state = initialState,
  action: DrawerActionTypes
): DrawerState {
  switch (action.type) {
    case DRAWER_TOGGLED:
      return {
        ...state,
        open: !state.open
      }
    case DRAWER_WIDTH_CHANGED:
      return {
        ...state,
        width: action.width
      }
    case INIT_DRAWERSTATE:
      return initialState
    default:
      return state
  }
}
