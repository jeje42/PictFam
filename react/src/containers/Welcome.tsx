import * as React from "react"
import {useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles'
import { withSize } from 'react-sizeme'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { AppState } from '../store/index'
import {startPhotosFetched, selectPhoto, selectNextPhoto, selectPreviousPhoto} from '../store/photo/actions'
import { startFetchAlbums } from '../store/album/actions'
import { toggleDrawer } from '../store/drawer/actions'
import { AlbumState } from '../store/album/types'
import ThumnailsGalery from './ThumnailsGalery'
import DrawerAlbums from './DrawerAlbums'
import MainPhoto  from './MainPhoto'
import { Photo } from "../types/Photo"
import {logoutAction} from "../store/auth-profile/actions"
import CheckTokenValidComponent from './CheckTokenValidComponent'

interface WelcomeProps {
  startPhotosFetched: typeof startPhotosFetched,
  startFetchAlbums: typeof startFetchAlbums,
  selectPhoto: typeof selectPhoto,
  selectNextPhoto: typeof selectNextPhoto,
  selectPreviousPhoto: typeof selectPreviousPhoto,
  logoutAction: typeof logoutAction,
  photos: Array<Photo>,
  albums: AlbumState,
  size: any,
  toggleDrawer: typeof toggleDrawer,
  openDrawer: boolean,
  drawerWidth: number,
  token: string,
}

const useStyles = makeStyles(() => ({
  flexMainContainer: {
    height: '100%',
  },
  galery: {
    position: 'fixed',
    top: 0,
    left: 0,
    right:0,
  },
  mainPhoto: {
    marginTop: 'auto',
    marginBottom: 'auto',
  }
}))

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
        flexShrink: 0
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

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleLogout = () => {
      handleClose()
      props.logoutAction()
    }

    let drawerElem = null
    if (props.albums.albums.length>0) {
      const ITEM_HEIGHT = 48;

        drawerElem = (
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
              <Avatar>H</Avatar>
              <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: 200,
                    },
                  }}
              >
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
    }

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
      </div>
    )
}

const mapStateToProps = (state: AppState) => ({
  photos: state.photos.photosSelected,
  albums: state.albums,
  openDrawer: state.drawer.open,
  drawerWidth: state.drawer.width,
  token: state.auth.token,
})

export default withSize({ monitorHeight: true })(connect(
  mapStateToProps,
  { startPhotosFetched, selectPhoto, selectNextPhoto, selectPreviousPhoto,
    startFetchAlbums,
    toggleDrawer,
    logoutAction,
  }
)(Welcome))
