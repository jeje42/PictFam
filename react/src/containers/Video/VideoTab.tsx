import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import { Video } from '../../types/Video';
import { OndemandVideo } from '@material-ui/icons';
import { selectVideoForReading } from '../../store/video/actions';
import { IconButton, List, ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import MyImgElement from '../MyImgElement';

interface VideoTabProps {
  videos: Video[];
  selectVideoForReading: typeof selectVideoForReading;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflow: 'auto',
      maxHeight: 500,
    },
  }),
);

const VideoTab: React.FC<VideoTabProps> = props => {
  const classes = useStyles();

  const imageWidth = 10;
  const imgStyle = {
    margin: '10px',
    borderRadius: '5px',
    width: `${imageWidth}em`,
    height: `${(imageWidth * 9) / 16}em`,
    // cursor: 'pointer',
    transition: 'all 2s',
    // '&:hover': {
    //   boxShadow: `5px 10px 18px ${theme.palette.primary.light}`,
    // },
  };

  return (
    <>
      <List className={classes.root}>
        {props.videos.map((video: Video) => (
          <ListItem key={video.id}>
            <MyImgElement
              key={video.id}
              imgUrl={`thumnailVideo/${video.id}`}
              styleRaw={{
                ...imgStyle,
              }}
            />
            <ListItemText primary={video.name} secondary={video.name} />
            <ListItemSecondaryAction onClick={() => props.selectVideoForReading(video)}>
              <IconButton edge='end' aria-label='delete'>
                <OndemandVideo />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  videos: state.videos.videosSelected,
});

export default connect(mapStateToProps, { selectVideoForReading })(VideoTab);
