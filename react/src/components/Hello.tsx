import * as React from "react"
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Types from 'MyTypes';

import { loadFromServer } from '../rest/methods'
import { Photo } from '../types/Photo'

import { AppState } from '../store/index'
import { addPhotos } from '../store/photo/actions'
import { PhotosState } from '../store/photo/types'

interface OwnProps {
  addPhotos: typeof addPhotos
  photos: PhotosState
}

const Hello = (props: OwnProps) => {
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

    console.log("PhotosInElement")
    console.log(props.photos.photos)
    let photosElem = null
    if(props.photos.photos.length>0) {
      photosElem = props.photos.photos.map((photo:Photo) => {
        return (
          <div>{photo.name}</div>
        )
      })
    }

    return (
      <div>

      <h1>Hello !</h1>

      {photosElem}
      </div>
    )
}

const mapStateToProps = (state: AppState) => ({
  photos: state.photos
})

export default connect(
  mapStateToProps,
  { addPhotos }
)(Hello);
