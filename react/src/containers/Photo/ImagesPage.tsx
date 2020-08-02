import * as React from 'react';
import { useEffect } from 'react';
import { changeModule } from '../../store/app/actions';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import { Module } from '../../store/app/types';
import Welcome from '../Welcome';
import { withSize } from 'react-sizeme';
import MainPhoto from './MainPhoto';
import ThumnailsGalery from '../ThumnailsGalery';
import { useQuery } from '../../utils/routesUtils';
import { selectAlbum } from '../../store/album';
import { Album } from '../../types/Album';
import { findAlbumRecurs, generateAlbumListRecurs } from '../../store/album/utils';
import { newAlbumSelected, selectPhoto } from '../../store/photo/actions';
import { Photo } from '../../types/Photo';
import { AlbumMediaType } from '../../store/album/types';

interface ImagesPageProps {
  changeModule: typeof changeModule;
  selectAlbum: typeof selectAlbum;
  newAlbumSelected: typeof newAlbumSelected;
  selectPhoto: typeof selectPhoto;
  size: any;
  albums: Album[];
  photos: Photo[];
}

const ImagesPage: React.FC<ImagesPageProps> = ({ albums, photos, size, selectAlbum, newAlbumSelected, selectPhoto, changeModule }) => {
  const albumId = Number(useQuery().get('albumId'));
  const photoId = Number(useQuery().get('photoId'));

  useEffect(() => {
    changeModule(Module.Image);
  });

  useEffect(() => {
    if (albumId) {
      selectAlbum(albumId, AlbumMediaType.Image);
      const albumsSons: Album[] = [];
      const album: Album | undefined = findAlbumRecurs(albums, albumId);
      if (album) {
        albumsSons.push(album);
        generateAlbumListRecurs(album, albumsSons);
        newAlbumSelected(albumsSons);
      }
    } else {
      selectAlbum(-1, AlbumMediaType.Image);
      newAlbumSelected([]);
    }

    const photoFound: Photo | undefined = photos.find(photo => photo.id === photoId);
    selectPhoto(photoFound);
  }, [albums, selectAlbum, albumId, newAlbumSelected, photos, photoId, selectPhoto]);

  const mainElem = <MainPhoto screenWidth={size.width} screenHeight={size.height} />;

  const toolbarElem = <ThumnailsGalery screenWidth={size.width} />;

  return <Welcome mainElem={mainElem} toolbarElem={toolbarElem} />;
};

const mapStateToProps = (state: AppState) => ({
  albums: state.albums.imageAlbumsTree,
  photos: state.photos.photos,
});

export default withSize({ monitorHeight: true })(connect(mapStateToProps, { changeModule, selectAlbum, newAlbumSelected, selectPhoto })(ImagesPage));
