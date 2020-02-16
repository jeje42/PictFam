import * as React from "react"
import { makeStyles, createStyles } from '@material-ui/core/styles'
import clsx from 'clsx';
import { connect } from 'react-redux'

import { toggleDrawer } from '../store/drawer/actions'
import { Photo } from '../types/Photo'
import NavButton from './NavButton'
import { AppState } from "../store/index";
import MyImgElement from './MyImgElement'
import {selectNextPhoto, selectPreviousPhoto} from "../store/photo/actions";

interface MainPhotoProps {
  screenWidth: number,
  screenHeight: number,
  drawerWidth: number,
  openDrawer: boolean,
    photos: Array<Photo>,
    selectNextPhoto: typeof selectNextPhoto,
    selectPreviousPhoto: typeof selectPreviousPhoto
}

const MainPhoto: React.SFC<MainPhotoProps>  = (props) => {
    if(props.photos.length === 0) {
        return <></>
    }
    const photo = props.photos.filter(photo => photo.selected)[0]

    const computeImageHeight: () => number = () => {
      if(props.screenHeight === undefined){
        return 400
      }

      //56(thumnailHeight) + 20(thumnailMargin) + 80(mainPhotoMargin)
      return props.screenHeight - 156
    }

    const computeImageWidth: () => number = () => {
      if(props.screenWidth === undefined){
        return 711
      }

      //16(marginNavButton) + 56(buttonsWidth)
      return props.screenWidth - (200) - (props.openDrawer?props.drawerWidth:0)
    }

    const imageHeight = computeImageHeight()
    const imageWidth = computeImageWidth()

    const useStylesDrawer = makeStyles((theme: any) =>
      createStyles({
        content: {
          flexGrow: 1,
          padding: theme.spacing(3),
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: 0,

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          paddingTop: '96px',
          paddingBottom: '20px',
        },
        contentShift: {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: props.drawerWidth,

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          paddingTop: '96px',
          paddingBottom: '20px',
        },
      }),
    )

    const classesDrawer = useStylesDrawer()

    let imgElem = null
    if (photo) {
        const imgStyle = {
            borderRadius: '5px',
            maxHeight: imageHeight + 'px',
            maxWidth: imageWidth + 'px',
            objectFit: 'contain',
            boxShadow: '5px 10px 10px #1b4f1b',
        }
        imgElem = (
            <MyImgElement
                imgUrl={'photo/' + photo.id}
                styleRaw={imgStyle}
            />
        )
    }

    return (
        // <div className={classes.flexContainer}>
        <div
          className={clsx(classesDrawer.content, {
            [classesDrawer.contentShift]: props.openDrawer,
          })}
        >
          <NavButton
            onClick={props.selectNextPhoto}
            previous={true}
            disabled={false}
          />
          {imgElem}
          <NavButton
            onClick={props.selectPreviousPhoto}
            previous={false}
            disabled={false}
          />
        </div>
    )
}

const mapStateToProps = (state: AppState) => ({
  openDrawer: state.drawer.open,
  drawerWidth: state.drawer.width,
    photos: state.photos.photosSelected,
})

export default connect(
  mapStateToProps,
  { toggleDrawer, selectNextPhoto, selectPreviousPhoto, }
)(MainPhoto)
