export const DRAWER_TOGGLED = 'DRAWER_TOGGLED'

export interface DrawerState {
  open: boolean
}

interface ToggleDrawerAction {
  type: typeof DRAWER_TOGGLED
}


export type DrawerActionTypes = ToggleDrawerAction
