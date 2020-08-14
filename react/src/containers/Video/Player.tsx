import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import { Video } from '../../types/Video';
import { withSize } from 'react-sizeme'; // import css
import ReactPlayer from 'react-player';
import { Card, Typography } from '@material-ui/core';
import axios, { AxiosRequestConfig } from 'axios';

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

const playerRef = React.createRef<any>();

const MyPlayer: React.FC<PlayerProps> = props => {
  const [videoFullAdress, setVideoFullAddress] = useState<string>();
  const { videoReading, token, screenHeight, screenWidth, openDrawer, drawerWidth } = props;

  const computeImageHeight: () => number = () => {
    if (screenHeight === undefined) {
      return 400;
    }

    return screenHeight - 156;
  };

  const computeImageWidth: () => number = () => {
    if (screenWidth === undefined) {
      return 711;
    }

    return screenWidth - 200 - (openDrawer ? drawerWidth : 0);
  };

  useEffect(() => {
    if (videoReading) {
      setVideoFullAddress(`${videoAddress}?videoId=${videoReading.id}&token=${token}`);
    }
  }, [token, videoReading]);

  useEffect(() => {
    if (videoReading) {
      const getVideoUserStatusRequest: AxiosRequestConfig = {
        method: 'GET',
        url: `/videoUser`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          videoId: videoReading?.id,
        },
      };

      axios(getVideoUserStatusRequest)
        .then((response: { data: number; status: number }) => {
          const htmlvideo = playerRef.current?.getInternalPlayer();
          if (htmlvideo) {
            htmlvideo.currentTime = response.data;
          }
        })
        .catch(error => {
          console.error(`Could not get the video status: ${error}`);
        });
    }
  }, [videoReading, token]);

  const onProgressVideo = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    const postVideoUser: AxiosRequestConfig = {
      method: 'post',
      url: `/videoUser`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: {
        videoId: videoReading?.id,
        readingPosition: state.playedSeconds,
      },
    };

    axios(postVideoUser)
      .then(() => console.log('Progression saved'))
      .catch(e => console.error(e));
  };

  let imageHeight: number | undefined;
  let imageWidth: number | undefined;

  if (screenHeight && screenWidth) {
    imageHeight = computeImageHeight();
    imageWidth = computeImageWidth();
  }

  const useStyles = makeStyles(() =>
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

  let reactPlayer = <Typography variant={'h6'}>{`Aucune vidéo sélectionnée`}</Typography>;
  if (videoReading) {
    reactPlayer = (
      <ReactPlayer
        ref={playerRef}
        url={videoFullAdress}
        playing
        controls
        width={'100%'}
        height={'100%'}
        onProgress={onProgressVideo}
        progressInterval={10000}
      />
    );
    if (imageHeight && imageWidth) {
      reactPlayer = (
        <ReactPlayer
          ref={playerRef}
          url={videoFullAdress}
          playing
          controls
          width={`${imageWidth}px`}
          height={`${imageHeight}px`}
          onProgress={onProgressVideo}
          progressInterval={10000}
        />
      );
    }
  }

  return (
    <Card raised={true}>
      <div className={classes.container}>{reactPlayer}</div>
    </Card>
  );
};

const mapStateToProps = (state: AppState) => ({
  openDrawer: state.drawer.open,
  drawerWidth: state.drawer.width,
  token: state.auth.token,
  videoReading: state.videos.videoReading,
});

export default withSize({ monitorHeight: true })(connect(mapStateToProps, {})(MyPlayer));
