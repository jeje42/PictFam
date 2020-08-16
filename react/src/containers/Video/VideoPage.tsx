import * as React from 'react';
import { useEffect } from 'react';
import { changeModule, setVideoModule } from '../../store/app/actions';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import { Module, VideoModule } from '../../store/app/types';
import Welcome from '../Welcome';
import { withSize } from 'react-sizeme';
import MainVideo from './MainVideos';
import { useQuery } from '../../utils/routesUtils';
import { Album } from '../../types/Album';
import { selectAlbum } from '../../store/album';
import { newVideoAlbumSelected, selectVideoForReading } from '../../store/video/actions';
import { Video } from '../../types/Video';
import { Playlist } from '../../types/Playlist';
import { selectPlaylist } from '../../store/playlist/actions';
import { AlbumMediaType } from '../../store/album/types';

interface ImagesPageProps {
  changeModule: typeof changeModule;
  selectAlbum: typeof selectAlbum;
  newVideoAlbumSelected: typeof newVideoAlbumSelected;
  selectVideoForReading: typeof selectVideoForReading;
  selectPlaylist: typeof selectPlaylist;
  setVideoModule: typeof setVideoModule;
  size: any;
  videoAlbumsRecord: Record<number, Album>;
  videoParentAlbumsRecord: Record<number, Album[]>;
  videos: Video[];
  playlists: Playlist[];
  albumIdSelected: number;
  videoReading?: Video;
  videoModule: VideoModule;
}

const ImagesPage: React.FC<ImagesPageProps> = props => {
  const {
    videoAlbumsRecord,
    videoParentAlbumsRecord,
    videos,
    playlists,
    newVideoAlbumSelected,
    albumIdSelected,
    videoReading,
    videoModule,
    selectVideoForReading,
    selectAlbum,
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
    const selectVideosLogic = () => {
      selectAlbum(albumId, AlbumMediaType.Video);

      const albumsSons: Album[] = [];

      const addSonsRecurs = (parentId: number) => {
        albumsSons.push(videoAlbumsRecord[parentId]);
        if (videoParentAlbumsRecord[parentId]) {
          videoParentAlbumsRecord[parentId].forEach(a => addSonsRecurs(a.id));
        }
      };

      addSonsRecurs(albumId);
      newVideoAlbumSelected(albumsSons);
    };

    if (albumId) {
      selectVideosLogic();
    }
  }, [albumId, videoAlbumsRecord, videoParentAlbumsRecord, selectAlbum, newVideoAlbumSelected]);

  useEffect(() => {
    const videoModuleLogic = () => {
      if (albumId) {
        if (videoModule !== VideoModule.Video) {
          setVideoModule(VideoModule.Video);
        }
      } else if (playlistId) {
        if (videoModule !== VideoModule.Playlist) {
          setVideoModule(VideoModule.Playlist);
        }
      }
    };

    videoModuleLogic();
  }, [albumId, videoModule, playlistId, setVideoModule]);

  useEffect(() => {
    if (!albumId && playlistId) {
      if (albumIdSelected !== -1) {
        selectAlbum(-1, AlbumMediaType.Video);
      }
    }
  }, [albumId, playlistId, albumIdSelected, selectAlbum]);

  useEffect(() => {
    const playlistSelectionLogic = () => {
      if (albumId) {
        if (playlists.find(playlist => playlist.selected)) {
          selectPlaylist();
        }
      } else if (playlistId) {
        const playlistFound: Playlist | undefined = playlists.find(playlist => playlist.id === playlistId);
        if (playlistFound && !playlistFound.selected) {
          selectPlaylist(playlistFound);
        }
      }
    };

    playlistSelectionLogic();
  }, [albumId, playlistId, playlists, selectPlaylist]);

  useEffect(() => {
    const selectVideoFromVideoId = (videoId: number) => {
      const videoFound: Video | undefined = videos.find(video => video.id === videoId);
      if (videoFound) {
        selectVideoForReading(videoFound);
      }
    };

    if (albumId) {
      if (!videoReading || videoId !== videoReading.id) {
        selectVideoFromVideoId(videoId);
      }
    } else if (playlistId) {
      if (!videoReading || videoId !== videoReading.id) {
        selectVideoFromVideoId(videoId);
      }
    }
  }, [selectVideoForReading, videos, albumId, videoId, playlistId, videoReading]);

  const mainElem = <MainVideo screenWidth={props.size.width} screenHeight={props.size.height} />;

  return <Welcome mainElem={mainElem} toolbarElem={undefined} />;
};

const mapStateToProps = (state: AppState) => ({
  videoAlbumsRecord: state.albums.videoAlbumsRecord,
  videoParentAlbumsRecord: state.albums.videoParentAlbumsRecord,
  videos: state.videos.videos,
  playlists: state.playlists.playlists,
  albumIdSelected: state.albums.albumVideoIdSelected,
  videoReading: state.videos.videoReading,
  videoModule: state.app.videoModule,
});

export default withSize({ monitorHeight: true })(
  connect(mapStateToProps, { changeModule, selectAlbum, newVideoAlbumSelected, selectVideoForReading, selectPlaylist, setVideoModule })(ImagesPage),
);
