import * as React from "react"
import { makeStyles, createStyles } from '@material-ui/core/styles'
import clsx from 'clsx';
import { connect } from 'react-redux'

import { toggleDrawer } from '../store/drawer/actions'
import { Photo } from '../types/Photo'
import NavButton from './NavButton'
import { AppState } from "../store/index";

interface MainPhotoProps {
  photo: Photo,
  selectPrevious: () => void,
  selectNext: () => void,
  screenWidth: number,
  screenHeight: number,
  drawerWidth: number,
  openDrawer: boolean
}

const MainPhoto: React.SFC<MainPhotoProps>  = (props) => {
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

    const useStyles = makeStyles((theme: any) => ({
      flexContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        paddingTop: '96px',
        paddingBottom: '20px',
      },
      img: {
        borderRadius: '5px',
        maxHeight: imageHeight + 'px',
        maxWidth: imageWidth + 'px',
        objectFit: 'contain',
        boxShadow: '5px 10px 10px #1b4f1b',
      },
      margin: {
        margin: theme.spacing(1),
      },
      navPrev: {
        float: 'left'
      },
      navNext: {
        float: 'right'
      }
    }))

    const useStylesDrawer = makeStyles((theme: any) =>
      createStyles({
        content: {
          flexGrow: 1,
          padding: theme.spacing(3),
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: - props.drawerWidth,

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
          marginLeft: 0,

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          paddingTop: '96px',
          paddingBottom: '20px',
        },
      }),
    )

    const classes = useStyles()
    const classesDrawer = useStylesDrawer()

    let imgElem = null
    if (props.photo) {
      imgElem = (
        <img className={classes.img} src={'photo/' + props.photo.id}/>
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
            onClick={props.selectPrevious}
            previous={true}
          />
          {imgElem}
          <NavButton
            onClick={props.selectNext}
            previous={false}
          />
        </div>
    )
}

const mapStateToProps = (state: AppState) => ({
  openDrawer: state.drawer.open
})

export default connect(
  mapStateToProps,
  { toggleDrawer }
)(MainPhoto)
