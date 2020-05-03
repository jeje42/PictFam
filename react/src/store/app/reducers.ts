import { AppActionTypes, AppState, CHANGE_MODULE, CHANGE_VIDEO_MODULE, Module, VideoModule } from './types';

const initialState: AppState = {
  module: Module.Image,
  videoModule: VideoModule.Video,
};

export function appReducer(state = initialState, action: AppActionTypes): AppState {
  switch (action.type) {
    case CHANGE_MODULE:
      return {
        ...state,
        module: action.module,
      };
    case CHANGE_VIDEO_MODULE:
      return {
        ...state,
        videoModule: action.videoModule,
      };
    default:
      return state;
  }
}
