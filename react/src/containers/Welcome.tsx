import * as React from "react"
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { withSize } from 'react-sizeme'

import { loadFromServer } from '../rest/methods'

import { AppState } from '../store/index'
import { addPhotos, selectPhoto, selectNextPhoto, selectPreviousPhoto } from '../store/photo/actions'
import { PhotosState } from '../store/photo/types'
import ThumnailsGalery from './ThumnailsGalery'
import MainPhoto  from './MainPhoto'

interface WelcomeProps {
  addPhotos: typeof addPhotos,
  selectPhoto: typeof selectPhoto,
  selectNextPhoto: typeof selectNextPhoto,
  selectPreviousPhoto: typeof selectPreviousPhoto,
  photos: PhotosState,
  size: any
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
  const classes = useStyles();
    useEffect(() => {
      loadFromServer('photos', photosCallback)
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

    let mainPhotoElem = null
    let thumbsElem = null
    if(props.photos.photos.length>0) {
      mainPhotoElem = (
        <MainPhoto
          photo={props.photos.photos.filter(photo => photo.selected)[0]}
          selectPrevious={props.selectPreviousPhoto}
          selectNext={props.selectNextPhoto}
          screenWidth={props.size.width}
          screenHeight={props.size.height}
        />
      )
    }

    return (
      <div className={classes.flexMainContainer}>
        <div className={classes.galery}>
          <ThumnailsGalery
            screenWidth={props.size.width}
          />
        </div>

        {mainPhotoElem}
      </div>
    )
}

const mapStateToProps = (state: AppState) => ({
  photos: state.photos
})

export default withSize({ monitorHeight: true })(connect(
  mapStateToProps,
  { addPhotos, selectPhoto, selectNextPhoto, selectPreviousPhoto }
)(Welcome))
