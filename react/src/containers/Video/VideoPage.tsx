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
import { newAlbumSelected, selectVideoForReading } from '../../store/video/actions';
import { Video } from '../../types/Video';

interface ImagesPageProps {
  changeModule: typeof changeModule;
  selectAlbumVideo: typeof selectAlbumVideo;
  newAlbumSelected: typeof newAlbumSelected;
  selectVideoForReading: typeof selectVideoForReading;
  size: any;
  albums: Album[];
  videos: Video[];
}

const ImagesPage: React.FC<ImagesPageProps> = props => {
  const { albums, videos, newAlbumSelected, selectVideoForReading, selectAlbumVideo, changeModule } = props;
  const albumId = Number(useQuery().get('albumId'));
  const videoId = Number(useQuery().get('videoId'));

  useEffect(() => {
    changeModule(Module.Video);
  });

  useEffect(() => {
    if (albumId) {
      selectAlbumVideo(albumId);

      const albumsSons: Album[] = [];
      const album: Album | undefined = findAlbumRecurs(albums, albumId);
      if (album) {
        albumsSons.push(album);
        generateAlbumListRecurs(album, albumsSons);
        newAlbumSelected(albumsSons);
      }

      const videoFound: Video | undefined = videos.find(video => video.id === videoId);
      if (videoFound) {
        selectVideoForReading(videoFound);
      }
    }
  }, [newAlbumSelected, selectVideoForReading, selectAlbumVideo, videos, albumId, videoId, albums]);

  const mainElem = <MainVideo screenWidth={props.size.width} screenHeight={props.size.height} />;

  return <Welcome mainElem={mainElem} toolbarElem={undefined} />;
};

const mapStateToProps = (state: AppState) => ({
  albums: state.albums.albumsVideo,
  videos: state.videos.videos,
});

export default withSize({ monitorHeight: true })(
  connect(mapStateToProps, { changeModule, selectAlbumVideo, newAlbumSelected, selectVideoForReading })(ImagesPage),
);
