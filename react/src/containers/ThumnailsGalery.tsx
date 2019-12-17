import * as React from "react"
import { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { AppState } from '../store/index'

import { selectPhoto } from '../store/photo/actions'
import { Photo } from '../types/Photo'
import Thumnail from './Thumnail'
import NavButton from './NavButton'


interface ThumnailsGaleryProps {
  photos: Array<Photo>,
  screenWidth: number,
  selectPhoto: typeof selectPhoto,
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

const computeNumberOfImages: (number: number) => number = (screenWidth: number) => {
  if (screenWidth === undefined) {
     return 10
  }
  let widthTrunc = Math.trunc(screenWidth)
  //16(marginNavButton) + 56(buttonsWidth)
  return Math.trunc(widthTrunc/(144)) -1
}

const ThumnailsGalery: React.SFC<ThumnailsGaleryProps>  = (props) => {
    const classes = useStyles();

    const [indexBeginPhoto, setIndexBeginPhoto] = useState(-1)
    const [indexEndPhoto, setIndexEndPhoto] = useState(-1)

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

        let newIndexBeginPhoto: number = -1
        let newIndexEndPhoto: number = -1
        let numberOfImages: number = -1

        if (indexBeginPhoto === -1) {
          if (indexSelected === -1) {
            indexSelected = 0
          }
          newIndexBeginPhoto = indexSelected
          numberOfImages = computeNumberOfImages(props.screenWidth)
          newIndexEndPhoto = newIndexBeginPhoto + numberOfImages
        } else if (indexSelected > indexEndPhoto) {
          newIndexBeginPhoto = indexSelected
          numberOfImages = computeNumberOfImages(props.screenWidth)
          newIndexEndPhoto = newIndexBeginPhoto + numberOfImages
        } else if (indexSelected < indexBeginPhoto) {
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
    }, [props.photos])

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
    }, [props.screenWidth])

    const selectPhotoHandler: (photo: Photo) => void = (photo: Photo) => {
      props.selectPhoto(photo)
    }

    let thumbsElem = null
    if (
        props.photos !== undefined
        && props.photos.length > 0
        && indexBeginPhoto >= -0
        && indexEndPhoto < props.photos.length
          ) {
      let photosArrayShowed: Array<Photo> = []
      for(let i:number = indexBeginPhoto ; i<=indexEndPhoto; i++) {
        photosArrayShowed.push(props.photos[i])
      }

      console.log(indexBeginPhoto + ' ; ' + indexEndPhoto)

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
      <div className={classes.flexThumbs}>
        <NavButton
          onClick={() => previousPhotos()}
          previous={true}
        />

          {thumbsElem}

        <NavButton
          onClick={() => nextPhotos()}
          previous={false}
        />
      </div>
    )
}

const mapStateToProps = (state: AppState) => ({
  photos: state.photos.photos
})

export default connect(
  mapStateToProps,
  { selectPhoto }
)(ThumnailsGalery)
