export interface Album {
  id: number,
  name: string,
  photosId: string[]
}

export interface AlbumAxios {
  id: number,
  name: string,
  _links: {
    photos: {
      href: string
    }
  }
}
