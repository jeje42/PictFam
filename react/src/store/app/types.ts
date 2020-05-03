export const CHANGE_MODULE = 'CHANGE_MODULE';
export const CHANGE_VIDEO_MODULE = 'CHANGE_VIDEO_MODULE';

export enum Module {
  Image,
  Video,
}

export enum VideoModule {
  Video,
  Playlist,
}

export interface AppState {
  module: Module;
  videoModule: VideoModule;
}

export interface ChangeModule {
  type: typeof CHANGE_MODULE;
  module: Module;
}

export interface SetVideoModule {
  type: typeof CHANGE_VIDEO_MODULE;
  videoModule: VideoModule;
}

export type AppActionTypes = ChangeModule | SetVideoModule;
