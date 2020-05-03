import { CHANGE_MODULE, CHANGE_VIDEO_MODULE, ChangeModule, Module, SetVideoModule, VideoModule } from './types';

export function changeModule(module: Module): ChangeModule {
  return {
    type: CHANGE_MODULE,
    module,
  };
}

export function setVideoModule(videoModule: VideoModule): SetVideoModule {
  return {
    type: CHANGE_VIDEO_MODULE,
    videoModule,
  };
}
