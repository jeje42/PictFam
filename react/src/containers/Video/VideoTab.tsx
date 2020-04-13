import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import { Video } from '../../types/Video';
import { selectVideoForReading } from '../../store/video/actions';
import { Card, List, ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import MyImgElement from '../MyImgElement';
import { useHistory } from 'react-router-dom';
import { ROUTE_VIDEOS } from '../../utils/routesUtils';

interface VideoTabProps {
  videos: Video[];
  videoReading?: Video;
  albumId: number;
  height: number;
  selectVideoForReading: typeof selectVideoForReading;
}

const VideoTab: React.FC<VideoTabProps> = props => {
  const history = useHistory();
  const { height } = props;

  const classes = makeStyles((theme: Theme) => {
    return createStyles({
      root: {
        overflow: 'auto',
        maxHeight: `${height * 0.9}px`,
      },
    });
  })();

  const imageWidth = 10;
  const imgStyle = {
    margin: '10px',
    borderRadius: '5px',
    width: `${imageWidth}em`,
    height: `${(imageWidth * 9) / 16}em`,
    transition: 'all 2s',
  };

  return (
    <Card raised={true}>
      <List className={classes ? classes.root : undefined}>
        {props.videos.map((video: Video) => {
          return (
            <ListItem
              key={video.id}
              button={true}
              onClick={() => history.push(`${ROUTE_VIDEOS}?albumId=${props.albumId}&videoId=${video.id}`)}
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
      </List>
    </Card>
  );
};

const mapStateToProps = (state: AppState) => ({
  videos: state.videos.videosSelected,
  videoReading: state.videos.videoReading,
  albumId: state.albums.albumVideoIdSelected,
});

export default connect(mapStateToProps, { selectVideoForReading })(VideoTab);
