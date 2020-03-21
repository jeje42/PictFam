import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import { Video } from '../../types/Video';
import { PlayArrow, OndemandVideo } from '@material-ui/icons';
import { selectVideoForReading } from '../../store/video/actions';
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core';

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
  return (
    <>
      <List className={classes.root}>
        {props.videos.map((video: Video) => (
          <ListItem key={video.id}>
            <ListItemAvatar>
              <Avatar>
                <PlayArrow />
              </Avatar>
            </ListItemAvatar>
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
