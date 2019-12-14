import * as React from "react"
import { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigatePrevIcon from '@material-ui/icons/NavigateBefore';
import Fab from '@material-ui/core/Fab';
import { connect } from 'react-redux'
import { AppState } from '../store/index'

import { selectPhoto } from '../store/photo/actions'
import { Photo } from '../types/Photo'
import Thumnail from './Thumnail'


interface ThumnailsGaleryProps {
  photos: Array<Photo>,
  screenWidth: number,
  selectPhoto: typeof selectPhoto,
}

const useStyles = makeStyles(() => ({
  img: {
    // margin: theme.spacing(6, 0, 3),
    margin: '10px',
    borderRadius: '5px',
    width: '100px',
    height: '56px'
  },
  flexThumbs: {
    // margin: theme.spacing(6, 0, 3),
    flexDirection: 'row',
    display: 'flex',
    width: '100%',
    overflowX: 'auto',
    background: '#949994',
    alignItems: 'center',
  },
}))

const computeNumberOfImages: (number: number) => number = (screenWidth: number) => {
  if (screenWidth === undefined) {
     return 10
  }
  let widthTrunc = Math.trunc(screenWidth)
  return Math.trunc(widthTrunc/(20+100)) -1
}

const ThumnailsGalery: React.SFC<ThumnailsGaleryProps>  = (props) => {
    const classes = useStyles();

    const [indexBeginPhoto, setIndexBeginPhoto] = useState(-1)
    const [currentNumberPhotos, setCurrentNumberPhotos] = useState(0)

    useEffect( () => {
      if (props.photos !== undefined && props.photos.length > 0) {
        let indexSelected = props.photos.indexOf(props.photos.filter(photo => photo.selected)[0])

        let changeState: boolean = false
        if (indexBeginPhoto === -1) {
          if (indexSelected === -1) {
            indexSelected = 0
          }
          changeState = true
        } else if (indexSelected >= indexBeginPhoto + currentNumberPhotos) {
          indexSelected = indexBeginPhoto + currentNumberPhotos
          if(indexSelected > props.photos.length) {
            indexSelected = props.photos.length - 1
          }
          changeState = true
        } else if (indexSelected < indexBeginPhoto) {
          indexSelected = indexBeginPhoto - currentNumberPhotos
          if(indexSelected < 0) {
            indexSelected = 0
          }
          changeState = true
        }

        if (changeState) {
          setIndexBeginPhoto(indexSelected)
          setCurrentNumberPhotos(computeNumberOfImages(props.screenWidth))
        }
      }
    }, [props.photos, props.screenWidth])

    const selectPhotoHandler: (photo: Photo) => void = (photo: Photo) => {
      props.selectPhoto(photo)
    }


    let thumbsElem = null
    if (props.photos !== undefined && props.photos.length > 0) {
      let indexEndShowed = indexBeginPhoto + currentNumberPhotos

      let photosArrayShowed: Array<Photo> = []
      for(let i:number = indexBeginPhoto ; i<indexEndShowed && i<props.photos.length; i++) {
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
      let nextIndexBegin = indexBeginPhoto + currentNumberPhotos
      if (nextIndexBegin > props.photos.length) {
        nextIndexBegin = props.photos.length
      }
      setIndexBeginPhoto(nextIndexBegin)
    }

    const previousPhotos = () => {
      let nextIndexBegin = indexBeginPhoto - currentNumberPhotos
      if (nextIndexBegin < 0) {
        nextIndexBegin = 0
      }
      setIndexBeginPhoto(nextIndexBegin)
    }

    return (
      <div className={classes.flexThumbs}>
        <Fab
          color="primary"
          aria-label="add"
          className={classes.margin}
          onClick={() => previousPhotos()}
        >
          <NavigatePrevIcon />
        </Fab>
        {thumbsElem}
        <Fab
          color="primary"
          aria-label="add"
          className={classes.margin}
          onClick={() => nextPhotos()}
        >
          <NavigateNextIcon />
        </Fab>
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
