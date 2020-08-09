import { Photo, PhotoFetched } from '../../types/Photo';
import { Album } from '../../types/Album';

export const photoFetchedToPhoto = (photoFetched: PhotoFetched, album: Album): Photo => ({
  id: photoFetched.id,
  name: photoFetched.name,
  _links: photoFetched._links,
  selected: false,
  album,
});
