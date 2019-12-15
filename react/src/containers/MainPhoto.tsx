import * as React from "react"
import { makeStyles } from '@material-ui/core/styles'

import { Photo } from '../types/Photo'
import NavButton from './NavButton'

interface MainPhotoProps {
  photo: Photo,
  selectPrevious: () => void,
  selectNext: () => void,
  screenWidth: number,
  screenHeight: number,
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
      return props.screenWidth - (144)
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
    const classes = useStyles();

    let imgElem = null
    if (props.photo) {
      imgElem = (
        <img className={classes.img} src={'photo/' + props.photo.id}/>
      )
    }

    return (
        <div className={classes.flexContainer}>
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

export default MainPhoto
