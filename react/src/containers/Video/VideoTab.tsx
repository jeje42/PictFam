import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import { Video } from '../../types/Video';
import { Card, List, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from '@material-ui/core';
import MyImgElement from '../MyImgElement';
import { useHistory } from 'react-router-dom';
import { ROUTE_VIDEOS } from '../../utils/routesUtils';
import { VideoModule } from '../../store/app/types';
import { Playlist } from '../../types/Playlist';
import { Add, Delete } from '@material-ui/icons';
import DialogAddToPlaylist from './DialogAddToPlaylist';
import axios, { AxiosRequestConfig } from 'axios';
import { ErrorAxios } from './playlistRequestHandling';
import { setPlaylist } from '../../store/playlist/actions';

interface VideoTabProps {
  videos: Video[];
  videoReading?: Video;
  albumId: number;
  playlists: Playlist[];
  height: number;
  token: string;
  videoModule: VideoModule;
  setPlaylist: typeof setPlaylist;
}

const VideoTab: React.FC<VideoTabProps> = props => {
  const history = useHistory();
  const { height } = props;
  const [videoModuleState, setVideoModuleState] = useState<VideoModule>(props.videoModule);
  const [videoModalAddToPlaylist, setVideoModalAddToPlaylist] = useState<Video[] | undefined>();

  const classes = makeStyles((theme: Theme) => {
    return createStyles({
      root: {
        overflow: 'auto',
        maxHeight: `${height * 0.9}px`,
      },
    });
  })();

  useEffect(() => {
    setVideoModuleState(props.videoModule);
  }, [props.videoModule]);

  const imageWidth = 10;
  const imgStyle = {
    margin: '10px',
    borderRadius: '5px',
    width: `${imageWidth}em`,
    height: `${(imageWidth * 9) / 16}em`,
    transition: 'all 2s',
  };

  let albumOrPlaylistId = `albumId=${props.albumId}`;
  let videos = props.videos;
  let dialogAddToPlaylist;
  let removeVideoFromPlaylist: { (index: number): void; (index: number): Promise<void> };
  if (VideoModule.Playlist === videoModuleState) {
    const playlistSelected = props.playlists.find(playlist => playlist.selected);
    if (playlistSelected) {
      videos = playlistSelected.videos;
      albumOrPlaylistId = `playlistId=${props.albumId}`;

      removeVideoFromPlaylist = async (index: number) => {
        let errorMessage: string | undefined;

        const newPlaylistObject: Playlist = {
          ...playlistSelected,
          videos: playlistSelected.videos.filter((video: Video, filterIndex: number) => filterIndex !== index),
        };

        debugger;

        const postRequestOption: AxiosRequestConfig = {
          method: 'post',
          url: `/playlist`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${props.token}`,
          },
        };

        const response: any = await axios.post(postRequestOption.url!, newPlaylistObject, postRequestOption).catch((error: ErrorAxios) => {
          errorMessage = error.response.data.message;
          if (!errorMessage) {
            errorMessage = 'Une erreur est survenue';
          }
        });

        if (errorMessage) {
          window.alert(errorMessage);
        } else {
          debugger;
          props.setPlaylist({
            ...response.data,
          });
        }
      };
    }
  } else if (props.videoModule === VideoModule.Video) {
    const handleCloseModalAddToPlaylist = () => {
      setVideoModalAddToPlaylist(undefined);
    };

    if (videoModalAddToPlaylist) {
      dialogAddToPlaylist = <DialogAddToPlaylist handleClose={handleCloseModalAddToPlaylist} videos={videoModalAddToPlaylist} />;
    }
  }

  let videosList = <Typography variant={'h6'}>{`Pas de videos dans ${props.videoModule === VideoModule.Playlist ? 'la playlist.' : "l'album."}`}</Typography>;
  if (videos.length > 0) {
    videosList = (
      <>
        {videos.map((video: Video, index: number) => {
          let addOrDeleteButton;
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
  playlists: state.playlists.playlists,
  videoModule: state.app.videoModule,
  token: state.auth.token,
});

export default connect(mapStateToProps, { setPlaylist })(VideoTab);
