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
  albums: Album[];
  videoModule: VideoModule;
  setPlaylist: typeof setPlaylist;
}

const findAlbumRecurs = (album: Album, albumId: number): Album | undefined => {
  if (album.id === albumId) {
    return album;
  }

  const albumSonFound = album.sons.find(son => son.id === albumId);
  if (albumSonFound) {
    return albumSonFound;
  }

  album.sons.forEach(son => {
    const albumFoundInSons = findAlbumRecurs(son, albumId);
    if (albumFoundInSons) {
      return albumFoundInSons;
    }
  });

  return undefined;
};

const VideoTab: React.FC<VideoTabProps> = props => {
  const { height } = props;
  const [videoModuleState, setVideoModuleState] = useState<VideoModule>(props.videoModule);
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

  const playlistSelected = props.playlists.find(playlist => playlist.selected);

  useEffect(() => {
    setVideoModuleState(props.videoModule);

    if (VideoModule.Video === props.videoModule) {
      setVideosDisplayed(props.videos);
    } else if (VideoModule.Playlist === props.videoModule && playlistSelected) {
      setVideosDisplayed(playlistSelected.videos);
    }
  }, [props.videoModule, playlistSelected, props.videos]);

  useEffect(() => {
    setSelectMode(false);
    setSelectModeVideoIndexes([]);
  }, [props.videoModule, props.albumId, playlistSelected]);

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
            Authorization: `Bearer ${props.token}`,
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
  } else if (props.videoModule === VideoModule.Video) {
    albumOrPlaylistId = `albumId=${props.albumId}`;

    let albumSelected: Album | undefined;
    props.albums.forEach(album => {
      const albumFound = findAlbumRecurs(album, props.albumId);
      if (albumFound) {
        albumSelected = albumFound;
      }
    });

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
        </ListItem>
      </List>
    );
  }

  let videosList = <Typography variant={'h6'}>{`Pas de videos dans ${props.videoModule === VideoModule.Playlist ? 'la playlist.' : "l'album."}`}</Typography>;
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
              videoModule={props.videoModule}
              videoReading={props.videoReading}
              moveVideoHovered={moveVideoHovered}
              saveAfterDrop={saveAfterDrop}
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
  albums: state.albums.albumsVideo,
  playlists: state.playlists.playlists,
  videoModule: state.app.videoModule,
  token: state.auth.token,
});

export default connect(mapStateToProps, { setPlaylist })(VideoTab);
