import { ALBUM_ADDED, ALBUM_SELECTED } from "./types";
import { Album } from '../../types/Album'
import { AlbumState } from './types'

export function addAlbums(newAlbums: Album[]) {
  return {
    type: ALBUM_ADDED,
    albums: newAlbums
  }
}

export function selectAlbum(album: Album) {
  return {
    type: ALBUM_SELECTED,
    album: album
  }
}
