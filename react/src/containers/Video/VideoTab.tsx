import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import { Video } from '../../types/Video';
import { Card, Checkbox, List, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from '@material-ui/core';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { VideoModule } from '../../store/app/types';
import { Playlist } from '../../types/Playlist';
import { LibraryAdd, DeleteOutlined } from '@material-ui/icons';
import DialogAddToPlaylist from './DialogAddToPlaylist';
import axios, { AxiosRequestConfig } from 'axios';
import { ErrorAxios } from './playlistRequestHandling';
import { setPlaylist } from '../../store/playlist/actions';
import { Album } from '../../types/Album';
import VideoListItem from './VideoListItem';
import { transformPlaylistToPlaylistForBackend } from '../../store/playlist/utils';

interface VideoTabProps {
  videos: Video[];
  videoReading?: Video;
  albumId: number;
  playlists: Playlist[];
  height: number;
  token: string;
  videoAlbumsRecord: Record<number, Album>;
  videoModule: VideoModule;
  setPlaylist: typeof setPlaylist;
}

const VideoTab: React.FC<VideoTabProps> = props => {
  const { albumId, height, videoAlbumsRecord, playlists, videos, videoModule, token, videoReading } = props;
  const [videoModuleState, setVideoModuleState] = useState<VideoModule>(videoModule);
  const [videoModalAddToPlaylist, setVideoModalAddToPlaylist] = useState<Video[] | undefined>();
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [selectModeVideoIndexes, setSelectModeVideoIndexes] = useState<number[]>([]);

  const [videosDisplayed, setVideosDisplayed] = useState<Video[]>([]);

  const classes = makeStyles(() => {
    return createStyles({
      root: {
        overflow: 'auto',
        maxHeight: `${height * 0.9}px`,
      },
    });
  })();

  const playlistSelected = playlists.find(playlist => playlist.selected);

  useEffect(() => {
    setVideoModuleState(videoModule);

    if (VideoModule.Video === videoModule) {
      setVideosDisplayed(videos);
    } else if (VideoModule.Playlist === videoModule && playlistSelected) {
      setVideosDisplayed(playlistSelected.videos);
    }
  }, [videoModule, playlistSelected, videos]);

  useEffect(() => {
    setSelectMode(false);
    setSelectModeVideoIndexes([]);
  }, [videoModule, albumId, playlistSelected]);

  let albumOrPlaylistId: string;
  let dialogAddToPlaylist;
  let removeVideoFromPlaylist: { (index: number): void; (index: number): Promise<void> };
  let headerList;
  let moveVideoHovered: (dragIndex: number, hoverIndex: number) => void;
  let saveAfterDrop: () => void;
  if (VideoModule.Playlist === videoModuleState) {
    if (playlistSelected) {
      albumOrPlaylistId = `playlistId=${playlistSelected.id}`;

      const postPlaylist = async (playlist: Playlist) => {
        let errorMessage: string | undefined;

        const postRequestOption: AxiosRequestConfig = {
          method: 'post',
          url: `/playlist`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };

        const response: any = await axios
          .post(postRequestOption.url!, transformPlaylistToPlaylistForBackend(playlist), postRequestOption)
          .catch((error: ErrorAxios) => {
            errorMessage = error.response.data.message;
            if (!errorMessage) {
              errorMessage = 'Une erreur est survenue';
            }
          });

        if (errorMessage) {
          window.alert(errorMessage);
        } else {
          props.setPlaylist({
            ...response.data,
          });
        }
      };

      removeVideoFromPlaylist = async (index: number) => {
        const newPlaylistObject: Playlist = {
          ...playlistSelected,
          videos: playlistSelected.videos.filter((video: Video, filterIndex: number) => filterIndex !== index),
        };

        await postPlaylist(newPlaylistObject);
      };

      const removeVideosFromPlaylist = async (indexes: number[]) => {
        const newPlaylistObject: Playlist = {
          ...playlistSelected,
          videos: playlistSelected.videos.filter((video: Video, filterIndex: number) => !indexes.includes(filterIndex)),
        };

        await postPlaylist(newPlaylistObject);
      };

      const emptyPlaylist = async () => {
        const newPlaylistObject: Playlist = {
          ...playlistSelected,
          videos: [],
        };

        await postPlaylist(newPlaylistObject);
      };

      moveVideoHovered = (dragIndex: number, hoverIndex: number) => {
        const dragVideo = videosDisplayed[dragIndex];

        setVideosDisplayed(
          update(videosDisplayed, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, dragVideo],
            ],
          }),
        );
      };

      saveAfterDrop = async () => {
        await postPlaylist({
          ...playlistSelected,
          videos: [...videosDisplayed],
        });
        console.log('Would like to save !');
      };

      headerList = (
        <List>
          <ListItem key={`PlaylistAlbum`}>
            <ListItemText primary={`Videos dans ${playlistSelected ? playlistSelected.name : `la playlist`}`} />
            <Tooltip title={'Activer/désactiver la sélection'}>
              <Checkbox
                checked={selectMode}
                onChange={() => {
                  setSelectMode(!selectMode);
                  setSelectModeVideoIndexes([]);
                }}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </Tooltip>
            <ListItemIcon>
              <Tooltip title={selectMode ? 'Enlever la sélection de la playlist' : `Vider la playlist`}>
                <DeleteOutlined
                  onClick={() => {
                    if (selectMode) {
                      if (selectModeVideoIndexes.length > 0) {
                        removeVideosFromPlaylist(selectModeVideoIndexes);
                      }
                    } else {
                      emptyPlaylist();
                    }
                  }}
                />
              </Tooltip>
            </ListItemIcon>
          </ListItem>
        </List>
      );
    }
  } else if (videoModule === VideoModule.Video) {
    albumOrPlaylistId = `albumId=${albumId}`;

    const albumSelected = videoAlbumsRecord[albumId];

    const handleCloseModalAddToPlaylist = () => {
      setVideoModalAddToPlaylist(undefined);
    };

    if (videoModalAddToPlaylist) {
      dialogAddToPlaylist = <DialogAddToPlaylist handleClose={handleCloseModalAddToPlaylist} videos={videoModalAddToPlaylist} />;
    }

    headerList = (
      <List>
        <ListItem key={`PlaylistAlbum`}>
          <ListItemText primary={`Videos dans ${albumSelected ? albumSelected.name : `l'album`}`} />
          {playlists.length > 0 ? (
            <>
              <Tooltip title={'Activer/désactiver la sélection'}>
                <Checkbox checked={selectMode} onChange={() => setSelectMode(!selectMode)} inputProps={{ 'aria-label': 'primary checkbox' }} />
              </Tooltip>
              <ListItemIcon>
                <Tooltip title={selectMode ? 'Ajouter la sélection à la playlist' : 'Ajouter tout à la playlist'}>
                  <LibraryAdd
                    onClick={() => {
                      if (selectMode) {
                        if (selectModeVideoIndexes.length > 0) {
                          setVideoModalAddToPlaylist(videosDisplayed.filter((video: Video, index: number) => selectModeVideoIndexes.includes(index)));
                        }
                      } else {
                        setVideoModalAddToPlaylist(videosDisplayed);
                      }
                    }}
                  />
                </Tooltip>
              </ListItemIcon>
            </>
          ) : undefined}
        </ListItem>
      </List>
    );
  }

  let videosList = <Typography variant={'h6'}>{`Pas de videos dans ${videoModule === VideoModule.Playlist ? 'la playlist.' : "l'album."}`}</Typography>;
  if (videosDisplayed.length > 0) {
    videosList = (
      <>
        {videosDisplayed.map((video: Video, index: number) => {
          return (
            <VideoListItem
              key={`${video.id}`}
              index={index}
              video={video}
              albumOrPlaylistId={albumOrPlaylistId}
              selectMode={selectMode}
              removeVideoFromPlaylist={removeVideoFromPlaylist}
              selectModeVideoIndexes={selectModeVideoIndexes}
              setSelectModeVideoIndexes={setSelectModeVideoIndexes}
              setVideoModalAddToPlaylist={setVideoModalAddToPlaylist}
              videoModule={videoModule}
              videoReading={videoReading}
              moveVideoHovered={moveVideoHovered}
              saveAfterDrop={saveAfterDrop}
              displayAddToPlaylist={playlists.length > 0}
            />
          );
        })}
        {dialogAddToPlaylist}
      </>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Card raised={true}>
        {headerList}
        <List className={classes.root}>{videosList}</List>
      </Card>
    </DndProvider>
  );
};

const mapStateToProps = (state: AppState) => ({
  videos: state.videos.videosSelected,
  videoReading: state.videos.videoReading,
  albumId: state.albums.albumVideoIdSelected,
  videoAlbumsRecord: state.albums.videoAlbumsRecord,
  playlists: state.playlists.playlists,
  videoModule: state.app.videoModule,
  token: state.auth.token,
});

export default connect(mapStateToProps, { setPlaylist })(VideoTab);
