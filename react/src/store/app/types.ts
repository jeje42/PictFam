export const CHANGE_MODULE = 'CHANGE_MODULE';

export enum Module {
  Image,
  Video,
}

export interface AppState {
  module: Module;
}

interface ChangeModule {
  type: typeof CHANGE_MODULE;
  module: Module;
}

export type AppActionTypes = ChangeModule;
