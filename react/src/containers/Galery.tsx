import * as React from "react"
import { createStyles, makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { Photo } from '../types/Photo'


interface GaleryProps {
  photos: Array<Photo>,
  selectPhoto: (photo: Photo) => void
}

const useStyles = makeStyles((theme: any) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
      margin: '20px',
      borderRadius: '10px',
      boxShadow: '5px 10px 10px #1b4f1b'
    },
    gridList: {
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    title: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    img: {
      borderRadius: '10px',
      cursor: 'pointer',
      '&:hover': {
        opacity: 0.5
      }
    },
    rooImgSelected: {
      backgroundColor: 'green'
    }
  }),
);

const Galery: React.SFC<GaleryProps>  = (props) => {

    const classes = useStyles();

    return (
      <div className={classes.root}>
        <GridList className={classes.gridList} cols={10}>
          {props.photos.map(photo => {
            let classesRootImg = []
            if (photo.selected) {
              classesRootImg.push(classes.rooImgSelected)
            }
            return (

            <GridListTile
              key={photo.id}
              classes={{
                tile: classes.img,
                root: classesRootImg.join(' ')
              }}
              onClick={() => props.selectPhoto(photo)}
              >
              <img src={'thumnail/' + photo.id} alt={photo.name} />
              <GridListTileBar
                title={photo.name}
                classes={{
                  root: classes.titleBar,
                  title: classes.title,
                }}
                actionIcon={
                  <IconButton aria-label={`star ${photo.name}`}>
                    <StarBorderIcon className={classes.title} />
                  </IconButton>
                }
              />
            </GridListTile>
          )})}
        </GridList>
      </div>
    )
}

export default Galery
