import { Album } from '../../types/Album';

export const generateAlbumListRecurs = (album: Album, finalList: Album[]) => {
  album.sons.forEach(album => {
    finalList.push(album);
    generateAlbumListRecurs(album, finalList);
  });
};

export const findAlbumRecurs = (albums: Album[], albumId: number): Album | undefined => {
  let toReturn = undefined;
  albums.forEach(album => {
    if (album.id === albumId) {
      toReturn = album;
      return;
    } else if (album.sons.length > 0) {
      const albumSon = findAlbumRecurs(album.sons, albumId);
      if (albumSon) {
        toReturn = albumSon;
        return;
      }
    }
  });
  return toReturn;
};

export const isSonSelectedRecurs = (albums: Album[], albumId: number): boolean => {
  let toReturn = false;
  albums.forEach(album => {
    if (album.id === albumId) {
      toReturn = true;
      return;
    } else if (album.sons.length > 0) {
      const albumSon = findAlbumRecurs(album.sons, albumId);
      if (albumSon) {
        toReturn = true;
        return;
      }
    }
  });
  return toReturn;
};
