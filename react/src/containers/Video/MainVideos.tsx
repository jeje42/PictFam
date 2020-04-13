import React, { useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import clsx from 'clsx';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import { toggleDrawer } from '../../store/drawer/actions';
import IconButton from '@material-ui/core/IconButton';
import { ViewColumn, ViewCompact, Menu } from '@material-ui/icons';
import Toolbar from '@material-ui/core/Toolbar';
import VideoTab from './VideoTab';
import Player from './Player';
import { Grid } from '@material-ui/core';

interface MainVideoProps {
  screenWidth: number;
  screenHeight: number;
  drawerWidth: number;
  openDrawer: boolean;
  toggleDrawer: typeof toggleDrawer;
  albumIdSelected: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return <>{value === index && <>{children}</>}</>;
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const MainVideo: React.FC<MainVideoProps> = props => {
  const classes = makeStyles((theme: Theme) => ({
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${props.drawerWidth}px)`,
      marginLeft: props.drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(1),
    },
    hide: {
      display: 'none',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: 0,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: props.drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
  }))();

  const [isAbumSelected, setIsAbumSelected] = useState<boolean>(props.albumIdSelected !== -1);
  const [imageFullWidth, setImageFullWidth] = useState(false);

  const toggleLayout = () => {
    setImageFullWidth(!imageFullWidth);
  };

  useEffect(() => {
    const newIsAlbumSelected = props.albumIdSelected !== -1;
    if (newIsAlbumSelected !== isAbumSelected) {
      setIsAbumSelected(newIsAlbumSelected);
    }
  }, [isAbumSelected, props.albumIdSelected]);

  return (
    <>
      <AppBar
        position='fixed'
        className={clsx(classes.appBar, {
          [classes.appBarShift]: props.openDrawer,
        })}
      >
        <Toolbar disableGutters={true}>
          <IconButton color='inherit' onClick={props.toggleDrawer} edge='start' className={clsx(classes.menuButton, props.openDrawer && classes.hide)}>
            <Menu />
          </IconButton>
          <IconButton color='inherit' onClick={toggleLayout} edge='start' className={clsx(classes.menuButton)}>
            {imageFullWidth ? <ViewColumn /> : <ViewCompact />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: props.openDrawer,
        })}
      >
        <div className={classes.toolbar} />
        <Grid container spacing={3}>
          {!isAbumSelected ? (
            <div>{`Sélectionnez d'abord un album.`}</div>
          ) : (
            <>
              <Grid item md={imageFullWidth ? 12 : 6} sm={12}>
                <Player screenWidth={imageFullWidth ? props.screenWidth : undefined} screenHeight={imageFullWidth ? props.screenHeight : undefined} />
              </Grid>
              <Grid item md={6} sm={12}>
                <VideoTab height={props.screenHeight} />
              </Grid>
            </>
          )}
        </Grid>
      </main>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  photos: state.photos.photosSelected,
  albumIdSelected: state.albums.albumVideoIdSelected,
  openDrawer: state.drawer.open,
  drawerWidth: state.drawer.width,
});

export default connect(mapStateToProps, { toggleDrawer })(MainVideo);
