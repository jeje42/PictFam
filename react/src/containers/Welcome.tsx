import * as React from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { withSize } from 'react-sizeme';

import { AppState } from '../store';
import { startPhotosFetched } from '../store/photo/actions';
import { startVideosFetched } from '../store/video/actions';
import { startFetchAlbumsImage, startFetchAlbumsVideo } from '../store/album/actions';
import ThumnailsGalery from './ThumnailsGalery';
import MainPhoto from './Photo/MainPhoto';
import CheckTokenValidComponent from './CheckTokenValidComponent';
import { Module } from '../store/app/types';
import MyBackdrop from './MyBackdrop';
import MyDrawer from './Drawer/MyDrawer';
import MainVideo from './Video/MainVideos';

interface WelcomeProps {
  startPhotosFetched: typeof startPhotosFetched;
  startVideosFetched: typeof startVideosFetched;
  startFetchAlbumsImage: typeof startFetchAlbumsImage;
  startFetchAlbumsVideo: typeof startFetchAlbumsVideo;
  size: any;
  currentModule: Module;
}

const Welcome = (props: WelcomeProps) => {
  const useStylesDrawer = makeStyles((theme: any) =>
    createStyles({
      root: {
        display: 'flex',
        height: '100%',
      },
      drawer: {
        flexShrink: 0,
      },
      drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'space-between',
      },
      drawerHeaderAccount: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
      },
    }),
  );

  const classesDrawer = useStylesDrawer();

  const { currentModule, startPhotosFetched, startFetchAlbumsImage, startFetchAlbumsVideo, startVideosFetched } = props;

  useEffect(() => {
    if (Module.Image === currentModule) {
      startPhotosFetched();
      startFetchAlbumsImage();
    } else if (Module.Video === currentModule) {
      startFetchAlbumsVideo();
      startVideosFetched();
    }
  }, [currentModule, startPhotosFetched, startFetchAlbumsImage, startFetchAlbumsVideo, startVideosFetched]);

  const mainElem =
    Module.Image === props.currentModule ? (
      <MainPhoto screenWidth={props.size.width} screenHeight={props.size.height} />
    ) : (
      <MainVideo screenWidth={props.size.width} screenHeight={props.size.height}></MainVideo>
    );

  const toolbarElement = props.currentModule === Module.Image ? <ThumnailsGalery screenWidth={props.size.width} /> : undefined;

  return (
    <div className={classesDrawer.root}>
      {toolbarElement}
      <MyDrawer />

      {mainElem}

      <CheckTokenValidComponent />

      <MyBackdrop />
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  photos: state.photos.photosSelected,
  token: state.auth.token,
  currentModule: state.app.module,
});

export default withSize({ monitorHeight: true })(
  connect(mapStateToProps, { startPhotosFetched, startVideosFetched, startFetchAlbumsImage, startFetchAlbumsVideo })(Welcome),
);
