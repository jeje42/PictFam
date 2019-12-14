import * as React from "react"
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigatePrevIcon from '@material-ui/icons/NavigateBefore';
import Fab from '@material-ui/core/Fab';

import { Photo } from '../types/Photo'


interface MainPhotoProps {
  photo: Photo,
  width: string,
  selectPrevious: () => void,
  selectNext: () => void
}

const MainPhoto: React.SFC<MainPhotoProps>  = (props) => {
    const useStyles = makeStyles((theme: any) => ({
      flexContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        // marginLeft: 'auto',
        // marginRight: 'auto',
      },
      img: {
        // margin: theme.spacing(6, 0, 3),
        borderRadius: '5px',
        // maxWidth: '100%',
        // maxHeight: '100%',
        // height: '300px',
        height: '400px',
        width: '711px',
        objectFit: 'contain',
        // boxShadow: '5px 10px 10px #1b4f1b',
      },
      margin: {
        margin: theme.spacing(1),
      },
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
          <Fab
            color="primary"
            aria-label="add"
            className={classes.margin}
            onClick={props.selectPrevious}
          >
            <NavigatePrevIcon />
          </Fab>
          {imgElem}
          <Fab
            color="primary"
            aria-label="add"
            className={classes.margin}
            onClick={props.selectNext}
          >
            <NavigateNextIcon />
          </Fab>
        </div>
    )
}

export {MainPhoto, MainPhotoProps}
