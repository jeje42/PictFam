import * as React from "react"
import {useEffect} from "react"
import {connect} from 'react-redux'
import {createStyles, makeStyles, useTheme} from '@material-ui/core/styles'
import {withSize} from 'react-sizeme'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import {AppState} from '../store/index'
import {selectNextPhoto, selectPhoto, selectPreviousPhoto, startPhotosFetched} from '../store/photo/actions'
import {startFetchAlbums} from '../store/album/actions'
import {toggleDrawer} from '../store/drawer/actions'
import {AlbumState} from '../store/album/types'
import ThumnailsGalery from './ThumnailsGalery'
import DrawerAlbums from './Drawer/DrawerAlbums'
import MainPhoto from './MainPhoto'
import {Photo} from "../types/Photo"
import {startScanAction, logoutAction} from "../store/auth-profile/actions"
import CheckTokenValidComponent from './CheckTokenValidComponent'
import {User} from "../types/User";
import {RoleName} from "../types/Role";

interface WelcomeProps {
  startPhotosFetched: typeof startPhotosFetched,
  startFetchAlbums: typeof startFetchAlbums,
  selectPhoto: typeof selectPhoto,
  selectNextPhoto: typeof selectNextPhoto,
  selectPreviousPhoto: typeof selectPreviousPhoto,
  startScanAction: typeof startScanAction,
  logoutAction: typeof logoutAction,
  photos: Array<Photo>,
  albums: AlbumState,
  size: any,
  toggleDrawer: typeof toggleDrawer,
  openDrawer: boolean,
  drawerWidth: number,
  token: string,
  albumIdSelected: number,
  userDetails?: User,
}

const Welcome = (props: WelcomeProps) => {
  const [drawerWidth, setDrawerWidth] = React.useState(0)

  const theme = useTheme()

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
      backdrop: {
        zIndex: theme.zIndex.drawer - 1,
        color: '#fff',
      },

    }),
  )

  const useDrawerOverride = makeStyles({
    drawerRoot: {
      backgroundColor: theme.palette.secondary.main
    }
  })

  const classesDrawer = useStylesDrawer()
  const classesDrawerOverride = useDrawerOverride()

  useEffect(() => {
    if (props.openDrawer) {
      if(props.drawerWidth) {
        setDrawerWidth(props.drawerWidth)
      } else {
        setDrawerWidth(240)
      }
    } else {
      setDrawerWidth(0)
    }
  }, [props.openDrawer, props.drawerWidth])

  useEffect(() => {
    props.startPhotosFetched(props.token)
    props.startFetchAlbums(props.token)
  }, [])

  useEffect(() => {
    if (props.albumIdSelected === -1) {
      setOpenBackdrop(true)
    } else {
      setOpenBackdrop(false)
    }
  }, [props.albumIdSelected])

    let mainPhotoElem = null
    if(props.photos.length>0) {
      mainPhotoElem = (
        <MainPhoto
          photo={props.photos.filter(photo => photo.selected)[0]}
          selectPrevious={props.selectPreviousPhoto}
          selectNext={props.selectNextPhoto}
          screenWidth={props.size.width}
          screenHeight={props.size.height}
        />
      )
    }

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  }

    const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
      setAnchorEl(null);
    };

  const handleStartScan = () => {
    handleCloseMenu()
    props.startScanAction(props.token)
  }

    const handleLogout = () => {
      handleCloseMenu()
      props.logoutAction()
    }

    const userNameAvatar = (userName: string): string => {
      if (userName === undefined || userName === null || userName === '') {
        return "U"
      }

      if (userName.length === 1) {
        return userName[0]
      } else {
        return userName[0] + userName[1]
      }
    }

    const userContainsRole = (user: User, roleName: RoleName) => {
      return user.roles.filter(role => role.name === roleName.toString()).length > 0
    }

      const ITEM_HEIGHT = 48;

    let startScanMenuItem
    if (props.userDetails && userContainsRole(props.userDetails, RoleName.ROLE_ADMIN)) {
      startScanMenuItem = (
          <MenuItem key={'startScan'} onClick={handleStartScan}>
            Start Scan
          </MenuItem>
      )
    }

      const drawerElem = (
        <Drawer
          className={classesDrawer.drawer}
          variant="persistent"
          anchor="left"
          open={props.openDrawer}
          classes={{
            paper: classesDrawerOverride.drawerRoot
          }}
        >
          <div className={classesDrawer.drawerHeader}>
            <div className={classesDrawer.drawerHeaderAccount}>
              <Avatar>{userNameAvatar((props.userDetails)?props.userDetails.name:'U')}</Avatar>
              <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClickMenu}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                  id="long-menu"
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
                {startScanMenuItem}
                <MenuItem key={'logout'} onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </div>
            <IconButton onClick={props.toggleDrawer}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <DrawerAlbums />
          <Divider />
        </Drawer>
    )

    let toolbarElement = (
      <ThumnailsGalery
        screenWidth={props.size.width}
      />
    )

    return (
      <div className={classesDrawer.root}>
        {toolbarElement}
        {drawerElem}
        {mainPhotoElem}

        <CheckTokenValidComponent/>

        <Backdrop className={classesDrawer.backdrop} open={openBackdrop} onClick={handleCloseBackdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    )
}

const mapStateToProps = (state: AppState) => ({
  photos: state.photos.photosSelected,
  albums: state.albums,
  openDrawer: state.drawer.open,
  drawerWidth: state.drawer.width,
  token: state.auth.token,
  albumIdSelected: state.albums.albumIdSelected,
  userDetails: state.auth.userDetails
})

export default withSize({ monitorHeight: true })(connect(
  mapStateToProps,
  { startPhotosFetched, selectPhoto, selectNextPhoto, selectPreviousPhoto,
    startFetchAlbums,
    toggleDrawer,
    startScanAction,
    logoutAction,
  }
)(Welcome))
