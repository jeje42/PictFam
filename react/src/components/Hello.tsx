import * as React from "react"
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux';
import Types from 'MyTypes';

import { loadFromServer } from '../rest/methods'
import { Photo } from '../types/Photo'
import { addPhotos } from '../store/photo/actions'

type OwnProps = {
  photos?: Array<Photo>
}

const newPhotosHandler = (photos: Array<Photo>) => async (dispatch: Dispatch): Promise<void> => {
  setTimeout(() => dispatch(addPhotos(photos)), 1000);
};

const Hello = () => {

    const [photos, setPhotos] = useState<Array<Photo>>(undefined)

    useEffect(() => {
      loadFromServer('photos', 100, photosCallback)
    }, [])

    const photosCallback = (results: Array<any>) => {
      let photosLocal = results.map((result: any) => {
        return {
          id: result.entity.id,
          name: result.entity.name
        }
      })
        setPhotos(photosLocal)

        console.log("Photos")
        console.log(photosLocal)
    }

    return (
      <div>

      <h1>Hello !</h1>

      </div>
    )
}

interface State {


}

const mapStateToProps = (state: Types.RootState, ownProps: OwnProps) => ({
  photos: state.photos
})

const mapDispatchToProps = (dispatch: Dispatch<Types.RootAction>) =>
  bindActionCreators(
    {
      onNewPhotos: newPhotosHandler,
    },
    dispatch
  )

export default connect()(Hello)
