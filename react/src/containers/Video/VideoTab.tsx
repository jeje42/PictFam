import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import { Video } from '../../types/Video';
import { Card, Checkbox, List, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from '@material-ui/core';
import MyImgElement from '../MyImgElement';
import { useHistory } from 'react-router-dom';
import { ROUTE_VIDEOS } from '../../utils/routesUtils';
import { VideoModule } from '../../store/app/types';
import { Playlist } from '../../types/Playlist';
import { Add, Delete, LibraryAdd, DeleteOutlined } from '@material-ui/icons';
import DialogAddToPlaylist from './DialogAddToPlaylist';
import axios, { AxiosRequestConfig } from 'axios';
import { ErrorAxios } from './playlistRequestHandling';
import { setPlaylist } from '../../store/playlist/actions';
import { Album } from '../../types/Album';

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
  const history = useHistory();
  const { height } = props;
  const [videoModuleState, setVideoModuleState] = useState<VideoModule>(props.videoModule);
  const [videoModalAddToPlaylist, setVideoModalAddToPlaylist] = useState<Video[] | undefined>();
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [selectModeVideoIndexes, setSelectModeVideoIndexes] = useState<number[]>([]);

  const classes = makeStyles((theme: Theme) => {
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
  }, [props.videoModule]);

  useEffect(() => {
    setSelectMode(false);
    setSelectModeVideoIndexes([]);
  }, [props.videoModule, props.albumId, playlistSelected]);

  const imageWidth = 10;
  const imgStyle = {
    margin: '10px',
    borderRadius: '5px',
    width: `${imageWidth}em`,
    height: `${(imageWidth * 9) / 16}em`,
    transition: 'all 2s',
  };

  let albumOrPlaylistId: string;
  let videos = props.videos;
  let dialogAddToPlaylist;
  let removeVideoFromPlaylist: { (index: number): void; (index: number): Promise<void> };
  let listHeader;
  if (VideoModule.Playlist === videoModuleState) {
    if (playlistSelected) {
      videos = playlistSelected.videos;
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

        const response: any = await axios.post(postRequestOption.url!, playlist, postRequestOption).catch((error: ErrorAxios) => {
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

      listHeader = (
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

    listHeader = (
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
                    setVideoModalAddToPlaylist(videos.filter((video: Video, index: number) => selectModeVideoIndexes.includes(index)));
                  }
                } else {
                  setVideoModalAddToPlaylist(videos);
                }
              }}
            />
          </Tooltip>
        </ListItemIcon>
      </ListItem>
    );
  }

  let videosList = <Typography variant={'h6'}>{`Pas de videos dans ${props.videoModule === VideoModule.Playlist ? 'la playlist.' : "l'album."}`}</Typography>;
  if (videos.length > 0) {
    videosList = (
      <>
        {listHeader}

        {videos.map((video: Video, index: number) => {
          let addOrDeleteButton;
          let selectionCheckbox;
          if (props.videoModule === VideoModule.Video) {
            addOrDeleteButton = (
              <ListItemIcon>
                <Tooltip title={`Ajouter à la playlist`}>
                  <Add
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setVideoModalAddToPlaylist([video]);
                    }}
                  />
                </Tooltip>
              </ListItemIcon>
            );

            const selectedVideoIndex = selectModeVideoIndexes.indexOf(index);
            if (selectMode) {
              selectionCheckbox = (
                <Tooltip title={`${selectedVideoIndex === -1 ? 'Sélectionner la video' : 'Déselectionner la video'}`}>
                  <Checkbox
                    checked={selectedVideoIndex !== -1}
                    onClick={(e: any) => {
                      e.stopPropagation();
                    }}
                    onChange={(e: any) => {
                      if (selectedVideoIndex === -1) {
                        setSelectModeVideoIndexes(selectModeVideoIndexes.concat(index));
                      } else {
                        setSelectModeVideoIndexes(selectModeVideoIndexes.filter((index: number) => index !== selectedVideoIndex));
                      }
                    }}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </Tooltip>
              );
            }
          } else {
            addOrDeleteButton = (
              <ListItemIcon>
                <Tooltip title={`Retirer de la playlist`}>
                  <Delete
                    onClick={(e: any) => {
                      e.stopPropagation();
                      removeVideoFromPlaylist(index);
                    }}
                  />
                </Tooltip>
              </ListItemIcon>
            );

            const selectedVideoIndex = selectModeVideoIndexes.indexOf(index);
            if (selectMode) {
              selectionCheckbox = (
                <Tooltip title={`${selectedVideoIndex === -1 ? 'Sélectionner la video' : 'Déselectionner la video'}`}>
                  <Checkbox
                    checked={selectedVideoIndex !== -1}
                    onClick={(e: any) => {
                      e.stopPropagation();
                    }}
                    onChange={(e: any) => {
                      if (selectedVideoIndex === -1) {
                        setSelectModeVideoIndexes(selectModeVideoIndexes.concat(index));
                      } else {
                        setSelectModeVideoIndexes(selectModeVideoIndexes.filter((index: number) => index !== selectedVideoIndex));
                      }
                    }}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </Tooltip>
              );
            }
          }

          return (
            <ListItem
              key={video.id}
              button={true}
              onClick={() => history.push(`${ROUTE_VIDEOS}?${albumOrPlaylistId}&videoId=${video.id}`)}
              selected={props.videoReading && props.videoReading === video}
            >
              <MyImgElement
                key={video.id}
                imgUrl={`thumnailVideo/${video.id}`}
                styleRaw={{
                  ...imgStyle,
                }}
              />
              <ListItemText primary={video.name} secondary={video.name} />
              {selectionCheckbox}
              {addOrDeleteButton}
            </ListItem>
          );
        })}
        {dialogAddToPlaylist}
      </>
    );
  }

  return (
    <Card raised={true}>
      <List className={classes.root}>{videosList}</List>
    </Card>
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
