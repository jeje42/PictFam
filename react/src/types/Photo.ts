export interface Photo {
  id: number,
  name: string,
  selected: boolean
}

export interface PhotoAxios {
  id: number,
  name: string,
  _links: {
    album: {
      href: string
    }
  }
}
