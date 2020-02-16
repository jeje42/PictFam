import {
  ALBUM_IMAGE_FETCHED,
  ALBUM_IMAGE_SELECTED,
  ALBUM_VIDEO_FETCHED, ALBUM_VIDEO_SELECTED,
  AlbumImageFetchedAction,
  AlbumVideoFetchedAction,
  SelectAlbumImageAction,
  SelectAlbumVideoAction,
  START_ALBUM_IMAGE_FETCHED,
  START_ALBUM_VIDEO_FETCHED,
  StartFetchAlbumsImageAction,
  StartFetchAlbumsVideoAction
} from "./types";
import { Album } from '../../types/Album'
import { AlbumState } from './types'

export function startFetchAlbumsImage(token: string): StartFetchAlbumsImageAction {
  return {
    type: START_ALBUM_IMAGE_FETCHED,
    token: token
  }
}

export function albumsImageFetch(newAlbums: Album[]): AlbumImageFetchedAction {
  return {
    type: ALBUM_IMAGE_FETCHED,
    albums: newAlbums
  }
}

export function selectAlbumImage(album: Album): SelectAlbumImageAction {
  return {
    type: ALBUM_IMAGE_SELECTED,
    album: album
  }
}


export function startFetchAlbumsVideo(token: string): StartFetchAlbumsVideoAction {
  return {
    type: START_ALBUM_VIDEO_FETCHED,
    token: token
  }
}

export function albumsVideoFetch(newAlbums: Album[]): AlbumVideoFetchedAction {
  return {
    type: ALBUM_VIDEO_FETCHED,
    albums: newAlbums
  }
}

export function selectAlbumVideo(album: Album): SelectAlbumVideoAction {
  return {
    type: ALBUM_VIDEO_SELECTED,
    album: album
  }
}