import * as React from "react"
import { makeStyles } from '@material-ui/core/styles';
import { Photo } from '../types/Photo'


interface MainPhotoProps {
  photo: Photo,
  width: string
}

const MainPhoto: React.SFC<MainPhotoProps>  = (props) => {
    const useStyles = makeStyles(() => ({
      img: {
        // margin: theme.spacing(6, 0, 3),
        borderRadius: '5px',
        width: '100%'
      },
    }))
    const classes = useStyles();

    return (
      <div>
        <img className={classes.img} src={'photo/' + props.photo.id}/>
      </div>
    )
}

export {MainPhoto, MainPhotoProps}
