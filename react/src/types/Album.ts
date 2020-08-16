import { Href } from './Href';

export interface AlbumFetched {
  id: number;
  name: string;
  isRoot: boolean;
  forPhoto: boolean;
  forVideo: boolean;
  _links: {
    father: Href;
    sons: Href;
    rights: Href;
  };
}

export interface Album {
  id: number;
  name: string;
  isRoot: boolean;
  parentId: number;
  _links: {
    father: Href;
    sons: Href;
    rights: Href;
  };
}
