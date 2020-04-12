import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { AppState } from '../store';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';

import { toggleDrawer } from '../store/drawer/actions';
import { Photo } from '../types/Photo';
import { ROUTE_IMAGES } from '../utils/routesUtils';
import { GridList, GridListTile, GridListTileBar } from '@material-ui/core';
import MyImgElement from './MyImgElement';

interface ThumnailsGaleryProps {
  photos: Photo[];
  albumIdSelected: number;
  screenWidth: number;
  drawerWidth: number;
  toggleDrawer: typeof toggleDrawer;
  openDrawer: boolean;
}

const ThumnailsGalery: React.SFC<ThumnailsGaleryProps> = props => {
  const useStylesDrawer = makeStyles((theme: any) =>
    createStyles({
      appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      },
      appBarShift: {
        width: `calc(100% - ${props.drawerWidth}px)`,
        marginLeft: props.drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      menuButton: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(1),
      },
      hide: {
        display: 'none',
      },
    }),
  );
  const history = useHistory();

  const classesDrawer = useStylesDrawer();

  const selectPhotoHandler: (photo: Photo) => void = (photo: Photo) => {
    history.push(`${ROUTE_IMAGES}?albumId=${props.albumIdSelected}&photoId=${photo.id}`);
  };

  let thumbsElem;

  const classes = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
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
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
      },
    }),
  )();

  if (props.photos !== undefined && props.photos.length > 0) {
    thumbsElem = (
      <GridList className={classes.gridList}>
        {props.photos.map(photo => (
          <GridListTile key={photo.id}>
            {/*<img src={tile.img} alt={tile.title} />*/}
            <MyImgElement imgUrl={`thumnail/${photo.id}`} />
            <GridListTileBar
              title={photo.name}
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
            />
          </GridListTile>
        ))}
      </GridList>
    );
  }

  return (
    // <div className={classes.flexThumbs}>
    <AppBar
      position='fixed'
      className={clsx(classesDrawer.appBar, {
        [classesDrawer.appBarShift]: props.openDrawer,
      })}
    >
      <Toolbar disableGutters={true}>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          onClick={props.toggleDrawer}
          edge='start'
          className={clsx(classesDrawer.menuButton, props.openDrawer && classesDrawer.hide)}
        >
          <MenuIcon />
        </IconButton>
        {/*{thumbsElem}*/}
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = (state: AppState) => ({
  photos: state.photos.photosSelected,
  albumIdSelected: state.albums.albumImageIdSelected,
  openDrawer: state.drawer.open,
  drawerWidth: state.drawer.width,
});

export default connect(mapStateToProps, { toggleDrawer })(ThumnailsGalery);
