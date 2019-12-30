export interface Album {
  id: number,
  name: string,
  isRoot: boolean,
  sons: Album[]
}
