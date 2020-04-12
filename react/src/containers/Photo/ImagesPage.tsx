import * as React from 'react';
import { changeModule } from '../../store/app/actions';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { Module } from '../../store/app/types';
import Welcome from '../Welcome';
import { withSize } from 'react-sizeme';
import MainPhoto from './MainPhoto';
import ThumnailsGalery from '../ThumnailsGalery';
import { useQuery } from '../../utils/routesUtils';
import { selectAlbumImage } from '../../store/album/actions';
import { Album } from '../../types/Album';
import { findAlbumRecurs, generateAlbumListRecurs } from '../../store/album/utils';
import { newAlbumSelected, selectPhoto } from '../../store/photo/actions';
import { Photo } from '../../types/Photo';

interface ImagesPageProps {
  changeModule: typeof changeModule;
  selectAlbumImage: typeof selectAlbumImage;
  newAlbumSelected: typeof newAlbumSelected;
  selectPhoto: typeof selectPhoto;
  size: any;
  albums: Album[];
  photos: Photo[];
}

const ImagesPage: React.FC<ImagesPageProps> = props => {
  const { albums, photos, selectAlbumImage, newAlbumSelected, selectPhoto } = props;
  const albumId = Number(useQuery().get('albumId'));
  const photoId = Number(useQuery().get('photoId'));

  useEffect(() => {
    props.changeModule(Module.Image);
  });

  useEffect(() => {
    if (albumId) {
      selectAlbumImage(albumId);
      const albumsSons: Album[] = [];
      const album: Album | undefined = findAlbumRecurs(albums, albumId);
      if (album) {
        albumsSons.push(album);
        generateAlbumListRecurs(album, albumsSons);
        newAlbumSelected(albumsSons);
      }
    } else {
      selectAlbumImage(-1);
      newAlbumSelected([]);
    }

    const photoFound: Photo | undefined = photos.find(photo => photo.id === photoId);
    selectPhoto(photoFound);
  }, [albums, selectAlbumImage, albumId, newAlbumSelected, photos, photoId, selectPhoto]);

  const mainElem = <MainPhoto screenWidth={props.size.width} screenHeight={props.size.height} />;

  const toolbarElem = <ThumnailsGalery screenWidth={props.size.width} />;

  return <Welcome mainElem={mainElem} toolbarElem={toolbarElem} />;
};

const mapStateToProps = (state: AppState) => ({
  albums: state.albums.albumsImage,
  photos: state.photos.photos,
});

export default withSize({ monitorHeight: true })(connect(mapStateToProps, { changeModule, selectAlbumImage, newAlbumSelected, selectPhoto })(ImagesPage));
