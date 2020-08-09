import { Album } from './Album';
import { Href } from './Href';

export interface PhotoFetched {
  id: number;
  name: string;
  _links: {
    self: Href;
    photo: Href;
    album: Href;
    rights: Href;
  };
}

export interface Photo extends PhotoFetched {
  selected: boolean;
  album: Album;
}
