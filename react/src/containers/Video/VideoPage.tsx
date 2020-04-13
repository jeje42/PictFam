import * as React from 'react';
import { changeModule } from '../../store/app/actions';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { Module } from '../../store/app/types';
import Welcome from '../Welcome';
import { withSize } from 'react-sizeme';
import MainVideo from './MainVideos';
import { useQuery } from '../../utils/routesUtils';
import { Album } from '../../types/Album';
import { selectAlbumVideo } from '../../store/album/actions';
import { findAlbumRecurs, generateAlbumListRecurs } from '../../store/album/utils';
import { newAlbumSelected } from '../../store/video/actions';

interface ImagesPageProps {
  changeModule: typeof changeModule;
  selectAlbumVideo: typeof selectAlbumVideo;
  newAlbumSelected: typeof newAlbumSelected;
  size: any;
  albums: Album[];
}

const ImagesPage: React.FC<ImagesPageProps> = props => {
  const { albums } = props;
  const albumId = Number(useQuery().get('albumId'));

  useEffect(() => {
    props.changeModule(Module.Video);
  });

  if (albumId) {
    props.selectAlbumVideo(albumId);

    const albumsSons: Album[] = [];
    const album: Album | undefined = findAlbumRecurs(albums, albumId);
    debugger;
    if (album) {
      albumsSons.push(album);
      generateAlbumListRecurs(album, albumsSons);
      props.newAlbumSelected(albumsSons);
    }
  }

  const mainElem = <MainVideo screenWidth={props.size.width} screenHeight={props.size.height} />;

  return <Welcome mainElem={mainElem} toolbarElem={undefined} />;
};

const mapStateToProps = (state: AppState) => ({
  albums: state.albums.albumsVideo,
});

export default withSize({ monitorHeight: true })(connect(mapStateToProps, { changeModule, selectAlbumVideo, newAlbumSelected })(ImagesPage));
