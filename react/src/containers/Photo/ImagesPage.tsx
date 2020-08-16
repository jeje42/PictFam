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
import { newImageAlbumSelected, selectPhoto } from '../../store/photo/actions';
import { Photo } from '../../types/Photo';
import { AlbumMediaType } from '../../store/album/types';

interface ImagesPageProps {
  changeModule: typeof changeModule;
  selectAlbum: typeof selectAlbum;
  newImageAlbumSelected: typeof newImageAlbumSelected;
  selectPhoto: typeof selectPhoto;
  size: any;
  imageAlbumsRecord: Record<number, Album>;
  imageParentAlbumsRecord: Record<number, Album[]>;
  photos: Photo[];
}

const ImagesPage: React.FC<ImagesPageProps> = ({
  imageAlbumsRecord,
  imageParentAlbumsRecord,
  photos,
  size,
  selectAlbum,
  newImageAlbumSelected,
  selectPhoto,
  changeModule,
}) => {
  const albumId = Number(useQuery().get('albumId'));
  const photoId = Number(useQuery().get('photoId'));

  useEffect(() => {
    changeModule(Module.Image);
  });

  useEffect(() => {
    if (albumId) {
      selectAlbum(albumId, AlbumMediaType.Image);
      const albumsSons: Album[] = [];

      const addSonsRecurs = (parentId: number) => {
        albumsSons.push(imageAlbumsRecord[parentId]);
        if (imageParentAlbumsRecord[parentId]) {
          imageParentAlbumsRecord[parentId].forEach(a => addSonsRecurs(a.id));
        }
      };

      addSonsRecurs(albumId);
      newImageAlbumSelected(albumsSons);
    } else {
      selectAlbum(-1, AlbumMediaType.Image);
      newImageAlbumSelected([]);
    }

    const photoFound: Photo | undefined = photos.find(photo => photo.id === photoId);
    selectPhoto(photoFound);
  }, [imageAlbumsRecord, imageParentAlbumsRecord, selectAlbum, albumId, newImageAlbumSelected, photos, photoId, selectPhoto]);

  const mainElem = <MainPhoto screenWidth={size.width} screenHeight={size.height} />;

  const toolbarElem = <ThumnailsGalery screenWidth={size.width} />;

  return <Welcome mainElem={mainElem} toolbarElem={toolbarElem} />;
};

const mapStateToProps = (state: AppState) => ({
  imageAlbumsRecord: state.albums.imageAlbumsRecord,
  imageParentAlbumsRecord: state.albums.imageParentAlbumsRecord,
  photos: state.photos.photos,
});

export default withSize({ monitorHeight: true })(connect(mapStateToProps, { changeModule, selectAlbum, newImageAlbumSelected, selectPhoto })(ImagesPage));
