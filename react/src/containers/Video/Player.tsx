import React, { useEffect, useState } from 'react';
// @ts-ignore
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import { Video } from '../../types/Video';
import { withSize } from 'react-sizeme'; // import css
import ReactPlayer from 'react-player'; //https://github.com/CookPete/react-player

interface PlayerProps {
  token: string;
  videoReading?: Video;
  size: any;
  screenWidth?: number;
  screenHeight?: number;
  drawerWidth: number;
  openDrawer: boolean;
}

const videoAddress = '/video';

const MyPlayer: React.FC<PlayerProps> = props => {
  const [videoFullAdress, setVideoFullAddress] = useState<string>();

  const computeImageHeight: () => number = () => {
    if (props.screenHeight === undefined) {
      return 400;
    }

    return props.screenHeight - 156;
  };

  const computeImageWidth: () => number = () => {
    if (props.screenWidth === undefined) {
      return 711;
    }

    return props.screenWidth - 200 - (props.openDrawer ? props.drawerWidth : 0);
  };

  useEffect(() => {
    if (props.videoReading) {
      setVideoFullAddress(`${videoAddress}?videoId=${props.videoReading.id}&token=${props.token}`);
    }
  }, [props.token, props.videoReading]);

  let imageHeight: number | undefined;
  let imageWidth: number | undefined;

  if (props.screenHeight && props.screenWidth) {
    imageHeight = computeImageHeight();
    imageWidth = computeImageWidth();
  }

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      container: {
        width: imageWidth,
        height: imageHeight,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    }),
  );

  const classes = useStyles();

  let reactPlayer = <ReactPlayer url={videoFullAdress} playing controls width={'100%'} height={'100%'} />;
  if (imageHeight && imageWidth) {
    reactPlayer = <ReactPlayer url={videoFullAdress} playing controls width={`${imageWidth}px`} height={`${imageHeight}px`} />;
  }

  return <div className={classes.container}>{reactPlayer}</div>;
};

const mapStateToProps = (state: AppState) => ({
  openDrawer: state.drawer.open,
  drawerWidth: state.drawer.width,
  token: state.auth.token,
  videoReading: state.videos.videoReading,
});

export default withSize({ monitorHeight: true })(connect(mapStateToProps, {})(MyPlayer));
