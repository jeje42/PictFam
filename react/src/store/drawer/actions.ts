import { DRAWER_TOGGLED, DRAWER_WIDTH_CHANGED } from "./types"

export function toggleDrawer() {
  return {
    type: DRAWER_TOGGLED
  }
}

export function drawerWidthChanged(width: number) {
  return {
    type: DRAWER_WIDTH_CHANGED,
    width: width
  }
}
