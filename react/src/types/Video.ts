import { Album } from './Album';
import { Href } from './Href';

export interface VideoFetched {
  id: number;
  name: string;
  _links?: {
    self: Href;
    photo: Href;
    album: Href;
    rights: Href;
  };
}

export interface Video extends VideoFetched {
  selected: boolean;
  album: Album;
}
