import { Album } from './Album';

export interface Video {
  id: number;
  name: string;
  selected: boolean;
  album: Album;
}
