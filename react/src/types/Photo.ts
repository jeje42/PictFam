import { Album } from "./Album";

export interface Photo {
  id: number,
  name: string,
  selected: boolean,
  album: Album
}
