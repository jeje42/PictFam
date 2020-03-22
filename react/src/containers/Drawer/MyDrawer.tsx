import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import DrawerAlbumsImage from './Photo/DrawerAlbums';
import DrawerAlbumsVideo from './Video/DrawerAlbums';
import Drawer from '@material-ui/core/Drawer';
import * as React from 'react';
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import { RoleName } from '../../types/Role';
import { Module } from '../../store/app/types';
import { AppState } from '../../store';
import { withSize } from 'react-sizeme';
import { connect } from 'react-redux';
import { selectNextPhoto, selectPhoto, selectPreviousPhoto, startPhotosFetched } from '../../store/photo/actions';
import { startVideosFetched } from '../../store/video/actions';
import { startFetchAlbumsImage } from '../../store/album/actions';
import { toggleDrawer } from '../../store/drawer/actions';
import { logoutAction, startScanAction } from '../../store/auth-profile/actions';
import { changeModule } from '../../store/app/actions';
import { User } from '../../types/User';
import { useHistory } from 'react-router-dom';
import { ROUTE_IMAGES, ROUTE_VIDEOS } from '../../utils/routesUtils';

const ITEM_HEIGHT = 48;

interface MyDrawerProps {
  userDetails?: User;
  currentModule: Module;
  openDrawer: boolean;
  toggleDrawer: typeof toggleDrawer;
  startScanAction: typeof startScanAction;
  logoutAction: typeof logoutAction;
  changeModule: typeof changeModule;
}

const useStyles = makeStyles((theme: any) =>
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
    backdrop: {
      zIndex: theme.zIndex.drawer - 1,
      color: '#fff',
    },
  }),
);

const userNameAvatar = (userName: string): string => {
  if (userName === undefined || userName === '') {
    return 'U';
  }

  if (userName.length === 1) {
    return userName[0];
  } else {
    return userName[0] + userName[1];
  }
};

const userContainsRole = (user: User, roleName: RoleName) => {
  return user.roles.filter(role => role.name === roleName.toString()).length > 0;
};

const MyDrawer: React.FC<MyDrawerProps> = props => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();

  const classesDrawerOverride = makeStyles({
    drawerRoot: {
      backgroundColor: theme.palette.secondary.main,
    },
  })();

  const [anchorEl, setAnchorEl] = React.useState<undefined | HTMLElement>(undefined);

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(undefined);
  };

  const handleStartScanImages = () => {
    handleCloseMenu();
    props.startScanAction('image');
  };

  const handleStartScanVideos = () => {
    handleCloseMenu();
    props.startScanAction('video');
  };

  const handleLogout = () => {
    handleCloseMenu();
    props.logoutAction();
  };

  let scanImagesMenuItem;
  let scanVideosMenuItem;
  if (props.userDetails && userContainsRole(props.userDetails, RoleName.ROLE_ADMIN)) {
    scanImagesMenuItem = (
      <MenuItem key={'startImages'} onClick={handleStartScanImages}>
        Scan Images
      </MenuItem>
    );
    scanVideosMenuItem = (
      <MenuItem key={'startVideos'} onClick={handleStartScanVideos}>
        Scan Videos
      </MenuItem>
    );
  }

  const moduleSwitchItem = (
    <MenuItem key={'switchModule'} onClick={() => history.push(props.currentModule === Module.Image ? ROUTE_VIDEOS : ROUTE_IMAGES)}>
      {props.currentModule === Module.Image ? 'Films' : 'Photos'}
    </MenuItem>
  );

  const open = Boolean(anchorEl);

  const drawerAlbums = props.currentModule === Module.Image ? <DrawerAlbumsImage /> : <DrawerAlbumsVideo />;

  return (
    <Drawer
      className={classes.drawer}
      variant='persistent'
      anchor='left'
      open={props.openDrawer}
      classes={{
        paper: classesDrawerOverride.drawerRoot,
      }}
    >
      <div className={classes.drawerHeader}>
        <div className={classes.drawerHeaderAccount}>
          <Avatar>{userNameAvatar(props.userDetails ? props.userDetails.name : 'U')}</Avatar>
          <IconButton aria-label='more' aria-controls='long-menu' aria-haspopup='true' onClick={handleClickMenu}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            id='long-menu'
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleCloseMenu}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: 200,
              },
            }}
          >
            {scanImagesMenuItem}
            {scanVideosMenuItem}
            {moduleSwitchItem}
            <MenuItem key={'logout'} onClick={handleLogout}>
              Logout
            </MenuItem>
          </Menu>
        </div>
        <IconButton onClick={props.toggleDrawer}>{theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
      </div>
      <Divider />
      {drawerAlbums}
      <Divider />
    </Drawer>
  );
};

const mapStateToProps = (state: AppState) => ({
  photos: state.photos.photosSelected,
  albums: state.albums,
  openDrawer: state.drawer.open,
  token: state.auth.token,
  userDetails: state.auth.userDetails,
  currentModule: state.app.module,
});

export default withSize({ monitorHeight: true })(
  connect(mapStateToProps, {
    startPhotosFetched,
    startVideosFetched,
    selectPhoto,
    selectNextPhoto,
    selectPreviousPhoto,
    startFetchAlbumsImage,
    toggleDrawer,
    startScanAction,
    logoutAction,
    changeModule,
  })(MyDrawer),
);
