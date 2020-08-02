import { Href } from './Href';

export interface AlbumFetched {
  id: number;
  name: string;
  isRoot: boolean;
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
  sons: Album[];
  _links: {
    father: Href;
    sons: Href;
    rights: Href;
  };
}
