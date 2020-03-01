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
}

const videoAddress = '/video';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      // maxWidth: '1000px',
      // width: '80%',
      // height: '80%',
      // maxHeight: '1000px',
      // maxHeight: '1000px',
      // width: '100%',
    },
  }),
);

const MyPlayer: React.FC<PlayerProps> = props => {
  const classes = useStyles();
  const [videoFullAdress, setVideoFullAddress] = useState<string>();

  useEffect(() => {
    if (props.videoReading) {
      setVideoFullAddress(`${videoAddress}?videoId=${props.videoReading.id}&token=${props.token}`);
    }
  }, [props.token, props.videoReading]);

  console.log(props.size.width);
  console.log(props.size.height);

  // @ts-ignore
  return (
    <div className={classes.container}>
      {/*<Player playsInline poster='/assets/poster.png' src={videoFullAdress} height={'100%'} fluid={true} />*/}
      {/*<video src={videoFullAdress} />*/}
      <ReactPlayer url={videoFullAdress} playing width={'100%'} height={'100%'} controls />
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  token: state.auth.token,
  videoReading: state.videos.videoReading,
});

export default withSize({ monitorHeight: true })(connect(mapStateToProps, {})(MyPlayer));
