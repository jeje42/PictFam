import * as React from "react"
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles'
import { withSize } from 'react-sizeme'
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import { loadFromDefaultApiServer, loadFromCustomApiServer } from '../rest/methods'

import { AppState } from '../store/index'
import { addPhotos, selectPhoto, selectNextPhoto, selectPreviousPhoto } from '../store/photo/actions'
import { addAlbums } from '../store/album/actions'
import { toggleDrawer } from '../store/drawer/actions'
import { PhotosState } from '../store/photo/types'
import { AlbumState } from '../store/album/types'
import ThumnailsGalery from './ThumnailsGalery'
import MainPhoto  from './MainPhoto'

interface WelcomeProps {
  addPhotos: typeof addPhotos,
  selectPhoto: typeof selectPhoto,
  selectNextPhoto: typeof selectNextPhoto,
  selectPreviousPhoto: typeof selectPreviousPhoto,
  addAlbums: typeof addAlbums,
  photos: PhotosState,
  albums: AlbumState,
  size: any,
  toggleDrawer: typeof toggleDrawer,
  openDrawer: boolean
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

const drawerWidth = 240;

const useStylesDrawer = makeStyles((theme: any) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100%',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  }),
)

const Welcome = (props: WelcomeProps) => {
  const classes = useStyles()

  const classesDrawer = useStylesDrawer();
  const theme = useTheme();

  useEffect(() => {
    loadFromDefaultApiServer('photos', photosCallback)
    loadFromCustomApiServer('albumstree', albumsTreeCallback)
  }, [])

    const photosCallback = (results: Array<any>) => {
      let photosLocal: PhotosState = {
        photos: results.map((result: any) => {
          return {
            id: result.id,
            name: result.name,
            selected: false
          }
        })
      }

      props.addPhotos(photosLocal)
      props.selectPhoto(photosLocal.photos[0])
    }

    const albumsTreeCallback = (resData: any) => {
      let albumState: AlbumState = {
        albums: resData
      }
      props.addAlbums(albumState)
    }

    let mainPhotoElem = null
    if(props.photos.photos.length>0) {
      mainPhotoElem = (
        <MainPhoto
          photo={props.photos.photos.filter(photo => photo.selected)[0]}
          selectPrevious={props.selectPreviousPhoto}
          selectNext={props.selectNextPhoto}
          screenWidth={props.size.width}
          screenHeight={props.size.height}
          drawerWidth={drawerWidth}
        />
      )
    }

    let drawerElem = null
    if (props.albums.albums.length>0) {
        drawerElem = (
        <Drawer
          className={classesDrawer.drawer}
          variant="persistent"
          anchor="left"
          open={props.openDrawer}
          classes={{
            paper: classesDrawer.drawerPaper,
          }}
        >
          <div className={classesDrawer.drawerHeader}>
            <IconButton onClick={props.toggleDrawer}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      )
    }

    let toolbarElement = (
      <ThumnailsGalery
        screenWidth={props.size.width}
        drawerWidth={drawerWidth}
      />
    )

    return (
      <div className={classesDrawer.root}>
        {toolbarElement}
        {drawerElem}
        {mainPhotoElem}
      </div>
    )
}

const mapStateToProps = (state: AppState) => ({
  photos: state.photos,
  albums: state.albums,
  openDrawer: state.drawer.open
})

export default withSize({ monitorHeight: true })(connect(
  mapStateToProps,
  { addPhotos, selectPhoto, selectNextPhoto, selectPreviousPhoto,
    addAlbums,
    toggleDrawer
  }
)(Welcome))
