import { ALBUM_ADDED, ALBUM_SELECTED } from "./types";
import { Album } from '../../types/Album'
import { AlbumState } from './types'

export function addAlbums(newAlbum: AlbumState) {
  return {
    type: ALBUM_ADDED,
    albums: newAlbum.albums
  }
}

export function selectAlbum(album: Album) {
  return {
    type: ALBUM_SELECTED,
    album: album
  }
}
