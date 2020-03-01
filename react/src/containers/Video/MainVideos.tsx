import React, { useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Video } from '../../types/Video';
import clsx from 'clsx';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import { selectPhoto } from '../../store/photo/actions';
import { toggleDrawer } from '../../store/drawer/actions';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import VideoTab from './VideoTab';
import Player from './Player';

interface MainVideoProps {
  screenWidth: number;
  screenHeight: number;
  drawerWidth: number;
  openDrawer: boolean;
  // videos: Video[];
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

  // return <>{value === index && <>{children}</>}</>;
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
    // root: {
    //   flexGrow: 1,
    //   backgroundColor: theme.palette.background.paper,
    // },
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

      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%',
      paddingTop: '96px',
      paddingBottom: '20px',
      // paddingBottom: '116px',
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: props.drawerWidth,

      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%',
      paddingTop: '96px',
      paddingBottom: '20px',
      // paddingBottom: '116px',
    },
  }))();

  const [value, setValue] = React.useState(0);
  const [isAbumSelected, setIsAbumSelected] = useState<boolean>(props.albumIdSelected !== -1);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const newIsAlbumSelected = props.albumIdSelected !== -1;
    if (newIsAlbumSelected !== isAbumSelected) {
      setIsAbumSelected(newIsAlbumSelected);
    }
  }, [isAbumSelected, props.albumIdSelected]);

  const handleSwitchToPlayer = () => {
    setValue(0);
  };

  return (
    <>
      <AppBar
        position='fixed'
        className={clsx(classes.appBar, {
          [classes.appBarShift]: props.openDrawer,
        })}
      >
        <Toolbar disableGutters={true}>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={props.toggleDrawer}
            edge='start'
            className={clsx(classes.menuButton, props.openDrawer && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Tabs value={value} onChange={handleChange} aria-label='simple tabs example'>
            <Tab label='Lecteur' {...a11yProps(0)} />
            <Tab label='Films' {...a11yProps(1)} disabled={!isAbumSelected} />
          </Tabs>
        </Toolbar>
      </AppBar>
      <div
        className={clsx(classes.content, {
          [classes.contentShift]: props.openDrawer,
        })}
      >
        <TabPanel value={value} index={0}>
          {!isAbumSelected ? <div>{`Sélectionnez d'abord un album.`}</div> : <Player />}
        </TabPanel>
        <TabPanel value={value} index={1}>
          <VideoTab switchToPlayer={handleSwitchToPlayer} />
        </TabPanel>
      </div>
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
