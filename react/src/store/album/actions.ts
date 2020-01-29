import {ALBUM_FETCHED, ALBUM_SELECTED, START_ALBUM_FETCHED} from "./types";
import { Album } from '../../types/Album'
import { AlbumState } from './types'

export function startFetchAlbums(token: string) {
  return {
    type: START_ALBUM_FETCHED,
    token: token
  }
}

export function albumsFetch(newAlbums: Album[]) {
  return {
    type: ALBUM_FETCHED,
    albums: newAlbums
  }
}

export function selectAlbum(album: Album) {
  return {
    type: ALBUM_SELECTED,
    album: album
  }
}
