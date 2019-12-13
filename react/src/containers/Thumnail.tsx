import * as React from "react"
import { makeStyles } from '@material-ui/core/styles';
import { Photo } from '../types/Photo'


interface ThumnailProps {
  photo: Photo
}

const useStyles = makeStyles(() => ({
  img: {
    // margin: theme.spacing(6, 0, 3),
    margin: '10px',
    borderRadius: '5px',
    width: '100px',
    height: '56px'
  },
}))

const Thumnail: React.SFC<ThumnailProps>  = (props) => {
    const classes = useStyles();

    return (
      <div>
        <img className={classes.img} src={'thumnail/' + props.photo.id}/>
      </div>
    )
}

export {Thumnail, ThumnailProps}
