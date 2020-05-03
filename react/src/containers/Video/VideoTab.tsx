import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import { Video } from '../../types/Video';
import { Card, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import MyImgElement from '../MyImgElement';
import { useHistory } from 'react-router-dom';
import { ROUTE_VIDEOS } from '../../utils/routesUtils';
import { VideoModule } from '../../store/app/types';
import { Playlist } from '../../types/Playlist';

interface VideoTabProps {
  videos: Video[];
  videoReading?: Video;
  albumId: number;
  playlists: Playlist[];
  height: number;
  videoModule: VideoModule;
}

const VideoTab: React.FC<VideoTabProps> = props => {
  const history = useHistory();
  const { height } = props;
  const [videoModuleState, setVideoModuleState] = useState<VideoModule>(props.videoModule);

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
  if (VideoModule.Playlist === videoModuleState) {
    const playlistSelected = props.playlists.find(playlist => playlist.selected);
    if (playlistSelected) {
      videos = playlistSelected.videos;
      albumOrPlaylistId = `playlistId=${props.albumId}`;
    }
  }

  let videosList = <Typography variant={'h6'}>{`Pas de videos dans ${props.videoModule === VideoModule.Playlist ? 'la playlist.' : "l'album."}`}</Typography>;
  if (videos.length > 0) {
    videosList = (
      <>
        {videos.map((video: Video) => {
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
            </ListItem>
          );
        })}
      </>
    );
  }

  return (
    <Card raised={true}>
      <List className={classes ? classes.root : undefined}>{videosList}</List>
    </Card>
  );
};

const mapStateToProps = (state: AppState) => ({
  videos: state.videos.videosSelected,
  videoReading: state.videos.videoReading,
  albumId: state.albums.albumVideoIdSelected,
  playlists: state.playlists.playlists,
  videoModule: state.app.videoModule,
});

export default connect(mapStateToProps, {})(VideoTab);
