import * as React from "react"
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Types from 'MyTypes';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { withSize } from 'react-sizeme'

import { loadFromServer } from '../rest/methods'
import { Photo } from '../types/Photo'

import { AppState } from '../store/index'
import { addPhotos, selectPhoto, selectNextPhoto, selectPreviousPhoto } from '../store/photo/actions'
import { PhotosState } from '../store/photo/types'
import Thumnail  from './Thumnail'
import ThumnailsGalery from './ThumnailsGalery'
import {MainPhotoProps, MainPhoto}  from './MainPhoto'
import Galery from './Galery'


interface WelcomeProps {
  addPhotos: typeof addPhotos,
  selectPhoto: typeof selectPhoto,
  selectNextPhoto: typeof selectNextPhoto,
  selectPreviousPhoto: typeof selectPreviousPhoto,
  photos: PhotosState,
  size: any
}

const mainPhotoWidth: string = '50%'
const useStyles = makeStyles(() => ({
  flexMainContainer: {
    maxHeight: '100%'
  },
  mainPhoto: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '40px',
    marginTop: '40px',
    maxWidth: mainPhotoWidth,
  },
}))

const Welcome = (props: WelcomeProps) => {
  const classes = useStyles();
    useEffect(() => {
      loadFromServer('photos', 100, photosCallback)
    }, [])

    const photosCallback = (results: Array<any>) => {
      let photosLocal: PhotosState = {
        photos: results.map((result: any) => {
          return {
            id: result.entity.id,
            name: result.entity.name,
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
          width={mainPhotoWidth}
          selectPrevious={props.selectPreviousPhoto}
          selectNext={props.selectNextPhoto}
        />
      )
    }

    return (
      <div className={classes.flexMainContainer}>


        <ThumnailsGalery
          screenWidth={props.size.width}
        />

        <div className={classes.mainPhoto}>
          {mainPhotoElem}
        </div>
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
