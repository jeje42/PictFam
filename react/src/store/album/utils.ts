import { Album, AlbumFetched } from '../../types/Album';

export const albumFetchedToAlbum = (albumFetched: AlbumFetched, parentId: number): Album => ({
  ...albumFetched,
  parentId,
});
