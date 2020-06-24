import * as React from 'react';
import { changeModule, setVideoModule } from '../../store/app/actions';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { Module, VideoModule } from '../../store/app/types';
import Welcome from '../Welcome';
import { withSize } from 'react-sizeme';
import MainVideo from './MainVideos';
import { useQuery } from '../../utils/routesUtils';
import { Album } from '../../types/Album';
import { selectAlbumVideo } from '../../store/album/actions';
import { findAlbumRecurs, generateAlbumListRecurs } from '../../store/album/utils';
import { newAlbumSelected, selectVideoForReading } from '../../store/video/actions';
import { Video } from '../../types/Video';
import { Playlist } from '../../types/Playlist';
import { selectPlaylist } from '../../store/playlist/actions';

interface ImagesPageProps {
  changeModule: typeof changeModule;
  selectAlbumVideo: typeof selectAlbumVideo;
  newAlbumSelected: typeof newAlbumSelected;
  selectVideoForReading: typeof selectVideoForReading;
  selectPlaylist: typeof selectPlaylist;
  setVideoModule: typeof setVideoModule;
  size: any;
  albums: Album[];
  videos: Video[];
  playlists: Playlist[];
  albumIdSelected: number;
  videoReading?: Video;
  videoModule: VideoModule;
}

const ImagesPage: React.FC<ImagesPageProps> = props => {
  const {
    albums,
    videos,
    playlists,
    newAlbumSelected,
    albumIdSelected,
    videoReading,
    videoModule,
    selectVideoForReading,
    selectAlbumVideo,
    changeModule,
    selectPlaylist,
    setVideoModule,
  } = props;
  const albumId = Number(useQuery().get('albumId'));
  const playlistId = Number(useQuery().get('playlistId'));
  const videoId = Number(useQuery().get('videoId'));

  useEffect(() => {
    changeModule(Module.Video);
  });

  useEffect(() => {
    const selectVideoFromVideoId = (videoId: number) => {
      const videoFound: Video | undefined = videos.find(video => video.id === videoId);
      if (videoFound) {
        selectVideoForReading(videoFound);
      }
    };

    if (albumId) {
      if (albumIdSelected !== albumId) {
        const albumsSons: Album[] = [];
        const album: Album | undefined = findAlbumRecurs(albums, albumId);
        if (album) {
          selectAlbumVideo(albumId);

          albumsSons.push(album);
          generateAlbumListRecurs(album, albumsSons);
          newAlbumSelected(albumsSons);
        }
      }

      if (!videoReading || videoId !== videoReading.id) {
        selectVideoFromVideoId(videoId);
      }

      if (playlists.find(playlist => playlist.selected)) {
        selectPlaylist();
      }

      if (videoModule !== VideoModule.Video) {
        setVideoModule(VideoModule.Video);
      }
    } else if (playlistId) {
      const playlistFound: Playlist | undefined = playlists.find(playlist => playlist.id === playlistId);
      if (playlistFound && !playlistFound.selected) {
        selectPlaylist(playlistFound);
      }

      if (!videoReading || videoId !== videoReading.id) {
        selectVideoFromVideoId(videoId);
      }

      if (albumIdSelected !== -1) {
        selectAlbumVideo(-1);
      }

      if (videoModule !== VideoModule.Playlist) {
        setVideoModule(VideoModule.Playlist);
      }
    }
  }, [
    newAlbumSelected,
    selectVideoForReading,
    selectAlbumVideo,
    videos,
    albumId,
    videoId,
    playlistId,
    albums,
    selectPlaylist,
    setVideoModule,
    playlists,
    albumIdSelected,
    videoReading,
    videoModule,
  ]);

  const mainElem = <MainVideo screenWidth={props.size.width} screenHeight={props.size.height} />;

  return <Welcome mainElem={mainElem} toolbarElem={undefined} />;
};

const mapStateToProps = (state: AppState) => ({
  albums: state.albums.albumsVideo,
  videos: state.videos.videos,
  playlists: state.playlists.playlists,
  albumIdSelected: state.albums.albumVideoIdSelected,
  videoReading: state.videos.videoReading,
  videoModule: state.app.videoModule,
});

export default withSize({ monitorHeight: true })(
  connect(mapStateToProps, { changeModule, selectAlbumVideo, newAlbumSelected, selectVideoForReading, selectPlaylist, setVideoModule })(ImagesPage),
);
