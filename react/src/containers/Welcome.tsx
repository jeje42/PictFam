import * as React from "react"
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles'
import { withSize } from 'react-sizeme'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Divider from '@material-ui/core/Divider'

import { loadFromDefaultApiServer, loadFromCustomApiServer } from '../rest/methods'

import { AppState } from '../store/index'
import { addPhotos, selectPhoto, selectNextPhoto, selectPreviousPhoto } from '../store/photo/actions'
import { addAlbums } from '../store/album/actions'
import { toggleDrawer } from '../store/drawer/actions'
import { PhotosState } from '../store/photo/types'
import { AlbumState } from '../store/album/types'
import ThumnailsGalery from './ThumnailsGalery'
import DrawerAlbums from './DrawerAlbums'
import MainPhoto  from './MainPhoto'
import { Photo } from "../types/Photo"

interface WelcomeProps {
  addPhotos: typeof addPhotos,
  selectPhoto: typeof selectPhoto,
  selectNextPhoto: typeof selectNextPhoto,
  selectPreviousPhoto: typeof selectPreviousPhoto,
  addAlbums: typeof addAlbums,
  photos: Array<Photo>,
  albums: AlbumState,
  size: any,
  toggleDrawer: typeof toggleDrawer,
  openDrawer: boolean,
  drawerWidth: number
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
        justifyContent: 'flex-end',
      },
    }),
  )

  const classesDrawer = useStylesDrawer()
  const theme = useTheme()

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
    loadFromCustomApiServer('photostree', photosCallback)
    loadFromCustomApiServer('albumstree', albumsTreeCallback)
  }, [])

    const photosCallback = (results: Array<any>) => {
      let photosLocal: PhotosState = {
        photos: results.map((result: any) => {
          return {
            id: result.id,
            name: result.name,
            selected: false,
            album: result.album
          }
        }),
        photosSelected: []
      }

      props.addPhotos(photosLocal)
      props.selectPhoto(photosLocal.photos[0])
    }

    const albumsTreeCallback = (resData: any) => {
      props.addAlbums(resData)
    }

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

    let drawerElem = null
    if (props.albums.albums.length>0) {
        drawerElem = (
        <Drawer
          className={classesDrawer.drawer}
          variant="persistent"
          anchor="left"
          open={props.openDrawer}
        >
          <div className={classesDrawer.drawerHeader}>
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
      </div>
    )
}

const mapStateToProps = (state: AppState) => ({
  photos: state.photos.photosSelected,
  albums: state.albums,
  openDrawer: state.drawer.open,
  drawerWidth: state.drawer.width
})

export default withSize({ monitorHeight: true })(connect(
  mapStateToProps,
  { addPhotos, selectPhoto, selectNextPhoto, selectPreviousPhoto,
    addAlbums,
    toggleDrawer
  }
)(Welcome))
