import * as React from 'react';
import { connect } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { withSize } from 'react-sizeme';

import { AppState } from '../store';
import { startPhotosFetched } from '../store/photo/actions';
import { startVideosFetched } from '../store/video/actions';
import CheckTokenValidComponent from './CheckTokenValidComponent';
import MyBackdrop from './MyBackdrop';
import MyDrawer from './Drawer/MyDrawer';

interface WelcomeProps {
  startVideosFetched: typeof startVideosFetched;
  mainElem: React.ReactNode;
  toolbarElem: React.ReactNode;
}

const Welcome = (props: WelcomeProps) => {
  const classesDrawer = makeStyles((theme: any) =>
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
  )();

  return (
    <div className={classesDrawer.root}>
      {props.toolbarElem}
      <MyDrawer />

      {props.mainElem}

      <CheckTokenValidComponent />

      <MyBackdrop />
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  photos: state.photos.photosSelected,
  token: state.auth.token,
});

export default withSize({ monitorHeight: true })(connect(mapStateToProps, { startPhotosFetched, startVideosFetched })(Welcome));
