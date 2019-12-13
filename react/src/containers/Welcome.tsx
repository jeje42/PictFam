import * as React from "react"
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Types from 'MyTypes';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import { loadFromServer } from '../rest/methods'
import { Photo } from '../types/Photo'

import { AppState } from '../store/index'
import { addPhotos } from '../store/photo/actions'
import { PhotosState } from '../store/photo/types'
import {ThumnailProps, Thumnail}  from './Thumnail'
import {MainPhotoProps, MainPhoto}  from './MainPhoto'


interface WelcomeProps {
  addPhotos: typeof addPhotos
  photos: PhotosState
}

const mainPhotoWidth: string = '50%'
const useStyles = makeStyles(() => ({
  mainPhoto: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '40px',
    marginTop: '40px',
    width: mainPhotoWidth
  },
  flexThumbs: {
    // margin: theme.spacing(6, 0, 3),
    flexDirection: 'row',
    display: 'flex',
    width: '100%',
    overflowX: 'auto',
    background: '#949994'
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
            name: result.entity.name
          }
        })
      }

        props.addPhotos(photosLocal)
    }

    let mainPhotoElem = null
    let photosElem = null
    if(props.photos.photos.length>0) {
      mainPhotoElem = (
        <MainPhoto
          photo={props.photos.photos[0]}
          width={mainPhotoWidth}
        />
      )

      photosElem = props.photos.photos.map((photo:Photo) => {

        return (
          <Thumnail photo={photo}>
          </Thumnail>
        )
      })
    }

    return (
      <div>
        <div className={classes.mainPhoto}>
          {mainPhotoElem}
        </div>

        <div className={classes.flexThumbs}>
          {photosElem}
        </div>
      </div>
    )
}

const mapStateToProps = (state: AppState) => ({
  photos: state.photos
})

export default connect(
  mapStateToProps,
  { addPhotos }
)(Welcome);
