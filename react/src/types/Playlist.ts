import { Video } from './Video';

export interface Playlist {
  id: number;
  name: string;
  selected: boolean;
  videos: Video[];
}
