export const DRAWER_TOGGLED = 'DRAWER_TOGGLED'
export const DRAWER_WIDTH_CHANGED = 'DRAWER_WIDTH_CHANGED'
export const INIT_DRAWERSTATE = 'INIT_DRAWERSTATE'

export interface DrawerState {
  open: boolean,
  width: number
}

interface ToggleDrawerAction {
  type: typeof DRAWER_TOGGLED
}

interface DrawerWidthChangedAction {
  type: typeof DRAWER_WIDTH_CHANGED,
  width: number
}

interface InitDrawerStateAction {
  type: typeof INIT_DRAWERSTATE
}

export type DrawerActionTypes = ToggleDrawerAction | DrawerWidthChangedAction | InitDrawerStateAction
