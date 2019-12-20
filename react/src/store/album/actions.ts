import { ALBUM_ADDED, ALBUM_SELECTED } from "./types";
import { Album } from '../../types/Album'


export function addAlbum(newAlbum: Album) {
  return {
    type: ALBUM_ADDED,
    album: newAlbum
  }
}

export function selectAlbum(album: Album) {
  return {
    type: ALBUM_SELECTED,
    album: album
  }
}
