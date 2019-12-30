import { DrawerState, DrawerActionTypes, DRAWER_TOGGLED } from './types'

const initialState: DrawerState = {
  open: false
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
    default:
      return state
  }
}
