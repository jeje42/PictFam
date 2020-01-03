import * as React from "react"
import { useState, useEffect } from "react"
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { AppState } from '../store/index'
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import clsx from 'clsx';

import { selectPhoto } from '../store/photo/actions'
import { toggleDrawer } from '../store/drawer/actions'
import { Photo } from '../types/Photo'
import Thumnail from './Thumnail'
import NavButton from './NavButton'

interface ThumnailsGaleryProps {
  photos: Array<Photo>,
  albumIdSelected: number,
  screenWidth: number,
  selectPhoto: typeof selectPhoto,
  drawerWidth: number,
  toggleDrawer: typeof toggleDrawer,
  openDrawer: boolean
}

const useStyles = makeStyles(() => ({
  img: {
    margin: '10px',
    borderRadius: '5px',
    width: '100px',
    height: '56px'
  },
  flexThumbs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    display: 'flex',
    overflowX: 'auto',
    background: '#949994',
    alignItems: 'center',
    boxShadow: '5px 10px 10px #1b4f1b',
  },
}))

const ThumnailsGalery: React.SFC<ThumnailsGaleryProps>  = (props) => {
  const useStylesDrawer = makeStyles((theme: any) =>
    createStyles({
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
      },
      hide: {
        display: 'none',
      },
    }),
  )

  const computeNumberOfImages: (number: number) => number = (screenWidth: number) => {
    if (screenWidth === undefined) {
       return 10
    }
    let widthTrunc = Math.trunc(screenWidth)
    //8*2(marginNavButton) + 56(buttonsWidth)
    // 100(image width) + 10*2 (margin)
    return Math.trunc((widthTrunc - 16 - 112 - (props.openDrawer?props.drawerWidth:0))/(120)) - 2
  }

  const classesDrawer = useStylesDrawer()

  const [indexBeginPhoto, setIndexBeginPhoto] = useState(-1)
  const [indexEndPhoto, setIndexEndPhoto] = useState(-1)
  const [albumIdSelected, setAlbumIdSelected] = useState(-1)

  /**
   * Checks if the indexes of begin and end are within the limits of the number of images.
   * If no, begin is lower limited by 0 and end upper limited by props.photos.length
   * **/
  const checkLimits: (i1: number, i2: number, numberOfImages: number) => {newIndexBeginPhoto: number, newIndexEndPhoto: number} =
  (newIndexBeginPhoto: number, newIndexEndPhoto: number, numberOfImages: number) => {
    if (newIndexBeginPhoto < 0) {
      newIndexBeginPhoto = 0
      newIndexEndPhoto = 0 + numberOfImages
    } else if (newIndexEndPhoto >= props.photos.length) {
      newIndexEndPhoto = props.photos.length - 1
      newIndexBeginPhoto = newIndexEndPhoto - numberOfImages
      if (newIndexBeginPhoto<0) newIndexBeginPhoto = 0
    }

    return {
      newIndexBeginPhoto,
      newIndexEndPhoto
    }
  }

  useEffect( () => {
    if (props.photos !== undefined && props.photos.length > 0) {
      let indexSelected = props.photos.indexOf(props.photos.filter(photo => photo.selected)[0])

      let oldIndexBeginPhoto = indexBeginPhoto
      let oldIndexEndPhoto = indexEndPhoto
      let newIndexBeginPhoto = -1
      let newIndexEndPhoto = -1
      let numberOfImages = -1

      if(props.albumIdSelected !== albumIdSelected) {
        setAlbumIdSelected(props.albumIdSelected)
        oldIndexBeginPhoto = -1
        oldIndexEndPhoto = -1
      }

      if (oldIndexBeginPhoto === -1) {
        if (indexSelected === -1) {
          indexSelected = 0
        }
        newIndexBeginPhoto = indexSelected
        numberOfImages = computeNumberOfImages(props.screenWidth)
        newIndexEndPhoto = newIndexBeginPhoto + numberOfImages
      } else if (indexSelected > oldIndexEndPhoto) {
        newIndexBeginPhoto = indexSelected
        numberOfImages = computeNumberOfImages(props.screenWidth)
        newIndexEndPhoto = newIndexBeginPhoto + numberOfImages
      } else if (indexSelected < oldIndexBeginPhoto) {
        newIndexEndPhoto = indexSelected
        numberOfImages = computeNumberOfImages(props.screenWidth)
        newIndexBeginPhoto = newIndexEndPhoto - numberOfImages
      }

      if (newIndexBeginPhoto !== -1 || newIndexEndPhoto !== -1) {
        let result = checkLimits(newIndexBeginPhoto, newIndexEndPhoto, numberOfImages)

        setIndexBeginPhoto(result.newIndexBeginPhoto)
        setIndexEndPhoto(result.newIndexEndPhoto)
      }
    }
  }, [props.photos, props.albumIdSelected])

  useEffect( () => {
    if (props.photos !== undefined && props.photos.length > 0) {
      let indexSelected = props.photos.indexOf(props.photos.filter(photo => photo.selected)[0])
      let numberOfImages: number = computeNumberOfImages(props.screenWidth)
      let newIndexBeginPhoto: number = indexSelected - Math.trunc(numberOfImages/2)
      if (newIndexBeginPhoto < 0)   newIndexBeginPhoto = 0

      let newIndexEndPhoto: number = newIndexBeginPhoto + numberOfImages

      let result = checkLimits(newIndexBeginPhoto, newIndexEndPhoto, numberOfImages)

      setIndexBeginPhoto(result.newIndexBeginPhoto)
      setIndexEndPhoto(result.newIndexEndPhoto)
    }
  }, [props.screenWidth, props.openDrawer])

  const selectPhotoHandler: (photo: Photo) => void = (photo: Photo) => {
    props.selectPhoto(photo)
  }

  let thumbsElem = null
  if (
      props.photos !== undefined
      && props.photos.length > 0
      && indexBeginPhoto >= 0
      && indexEndPhoto < props.photos.length
        ) {
    let photosArrayShowed: Array<Photo> = []
    for(let i:number = indexBeginPhoto ; i<=indexEndPhoto; i++) {
      photosArrayShowed.push(props.photos[i])
    }

    thumbsElem = photosArrayShowed.map((photo: Photo) => {
      return (
        <Thumnail
          key={photo.id}
          photo={photo}
        selectPhoto={selectPhotoHandler}/>
      )})
  }

  const nextPhotos = () => {
    let numberOfImages: number = computeNumberOfImages(props.screenWidth)

    let newIndexBeginPhoto = indexEndPhoto + 1
    let newIndexEndPhoto = newIndexBeginPhoto + numberOfImages
    let result = checkLimits(newIndexBeginPhoto, newIndexEndPhoto, numberOfImages)

    setIndexBeginPhoto(result.newIndexBeginPhoto)
    setIndexEndPhoto(result.newIndexEndPhoto)
  }

  const previousPhotos = () => {
    let numberOfImages: number = computeNumberOfImages(props.screenWidth)
    let newIndexBeginPhoto = indexBeginPhoto - numberOfImages
    if (newIndexBeginPhoto < 0 ) newIndexBeginPhoto = 0
    let newIndexEndPhoto = newIndexBeginPhoto + numberOfImages
    let result = checkLimits(newIndexBeginPhoto, newIndexEndPhoto, numberOfImages)

    setIndexBeginPhoto(result.newIndexBeginPhoto)
    setIndexEndPhoto(result.newIndexEndPhoto)
  }

  return (
    // <div className={classes.flexThumbs}>
    <AppBar
      position="fixed"
      className={clsx(classesDrawer.appBar, {
        [classesDrawer.appBarShift]: props.openDrawer,
      })}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={props.toggleDrawer}
          edge="start"
          className={clsx(classesDrawer.menuButton, props.openDrawer && classesDrawer.hide)}
        >
          <MenuIcon />
        </IconButton>

        <NavButton
          onClick={() => previousPhotos()}
          previous={true}
        />

          {thumbsElem}

        <NavButton
          onClick={() => nextPhotos()}
          previous={false}
        />
      </Toolbar>
    </AppBar>
  )
}

const mapStateToProps = (state: AppState) => ({
  photos: state.photos.photosSelected,
  albumIdSelected: state.albums.albumIdSelected,
  openDrawer: state.drawer.open
})

export default connect(
  mapStateToProps,
  { selectPhoto, toggleDrawer }
)(ThumnailsGalery)
