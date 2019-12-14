import * as React from "react"
import { makeStyles } from '@material-ui/core/styles';
import { Photo } from '../types/Photo'


interface ThumnailProps {
  photo: Photo,
  selectPhoto: (photo: Photo) => void
}

const useStyles = makeStyles(() => ({
  divContainer: {
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.5
    }
  },
  divContainerSelected: {
    backgroundColor: 'green'
  },
  img: {
    // margin: theme.spacing(6, 0, 3),
    margin: '10px',
    borderRadius: '5px',
    width: '100px',
    height: '56px',
  },
}))

const Thumnail: React.SFC<ThumnailProps>  = (props) => {
    const classes = useStyles();

    let classesDiv = [classes.divContainer]
    if (props.photo.selected) {
      classesDiv.push(classes.divContainerSelected)
    }
    return (
      <div
        onClick={() => props.selectPhoto(props.photo)}
        className={classesDiv.join(' ')}
      >
        <img className={classes.img} src={'thumnail/' + props.photo.id}/>
      </div>
    )
}

export default Thumnail
