import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { AppState } from '../store';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import clsx from 'clsx';

import { selectPhoto } from '../store/photo/actions';
import { toggleDrawer } from '../store/drawer/actions';
import { Photo } from '../types/Photo';
import Thumnail from './Thumnail';
import NavButton from './NavButton';

interface ThumnailsGaleryProps {
  photos: Photo[];
  albumIdSelected: number;
  screenWidth: number;
  selectPhoto: typeof selectPhoto;
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

  const computeNumberOfImages: (number: number) => number = React.useCallback(
    (screenWidth: number) => {
      if (screenWidth === undefined) {
        return 10;
      }
      const widthTrunc = Math.trunc(screenWidth);
      //8*2(marginNavButton) + 56(buttonsWidth)
      // 100(image width) + 10*2 (margin)
      return Math.trunc((widthTrunc - 16 - 112 - 20 - (props.openDrawer ? props.drawerWidth : 0)) / 120) - 1;
    },
    [props.openDrawer, props.drawerWidth],
  );

  const classesDrawer = useStylesDrawer();

  const [indexBeginPhoto, setIndexBeginPhoto] = useState(-1);
  const [indexEndPhoto, setIndexEndPhoto] = useState(-1);
  const [albumIdSelected, setAlbumIdSelected] = useState(-1);

  /**
   * Checks if the indexes of begin and end are within the limits of the number of images.
   * If no, begin is lower limited by 0 and end upper limited by props.photos.length
   * **/
  const checkLimits: (i1: number, i2: number, numberOfImages: number) => { newIndexBeginPhoto: number; newIndexEndPhoto: number } = useCallback(
    (newIndexBeginPhoto: number, newIndexEndPhoto: number, numberOfImages: number) => {
      if (newIndexBeginPhoto < 0) {
        newIndexBeginPhoto = 0;
        newIndexEndPhoto = numberOfImages;
      } else if (newIndexEndPhoto >= props.photos.length) {
        newIndexEndPhoto = props.photos.length - 1;
        newIndexBeginPhoto = newIndexEndPhoto - numberOfImages;
        if (newIndexBeginPhoto < 0) newIndexBeginPhoto = 0;
      }

      return {
        newIndexBeginPhoto,
        newIndexEndPhoto,
      };
    },
    [props.photos.length],
  );

  useEffect(() => {
    if (props.photos !== undefined && props.photos.length > 0) {
      let indexSelected = props.photos.indexOf(props.photos.filter(photo => photo.selected)[0]);

      let oldIndexBeginPhoto = indexBeginPhoto;
      let oldIndexEndPhoto = indexEndPhoto;
      let newIndexBeginPhoto = -1;
      let newIndexEndPhoto = -1;
      let numberOfImages = -1;

      if (props.albumIdSelected !== albumIdSelected) {
        setAlbumIdSelected(props.albumIdSelected);
        oldIndexBeginPhoto = -1;
        oldIndexEndPhoto = -1;
      }

      if (oldIndexBeginPhoto === -1) {
        if (indexSelected === -1) {
          indexSelected = 0;
        }
        newIndexBeginPhoto = indexSelected;
        numberOfImages = computeNumberOfImages(props.screenWidth);
        newIndexEndPhoto = newIndexBeginPhoto + numberOfImages;
      } else if (indexSelected > oldIndexEndPhoto) {
        newIndexBeginPhoto = indexSelected;
        numberOfImages = computeNumberOfImages(props.screenWidth);
        newIndexEndPhoto = newIndexBeginPhoto + numberOfImages;
      } else if (indexSelected < oldIndexBeginPhoto) {
        newIndexEndPhoto = indexSelected;
        numberOfImages = computeNumberOfImages(props.screenWidth);
        newIndexBeginPhoto = newIndexEndPhoto - numberOfImages;
      }

      if (newIndexBeginPhoto !== -1 || newIndexEndPhoto !== -1) {
        const result = checkLimits(newIndexBeginPhoto, newIndexEndPhoto, numberOfImages);

        setIndexBeginPhoto(result.newIndexBeginPhoto);
        setIndexEndPhoto(result.newIndexEndPhoto);
      }
    }
  }, [props.photos, props.albumIdSelected, props.screenWidth, indexBeginPhoto, indexEndPhoto, albumIdSelected, computeNumberOfImages, checkLimits]);

  useEffect(() => {
    if (props.photos !== undefined && props.photos.length > 0) {
      const indexSelected = props.photos.indexOf(props.photos.filter(photo => photo.selected)[0]);
      const numberOfImages: number = computeNumberOfImages(props.screenWidth);
      let newIndexBeginPhoto: number = indexSelected - Math.trunc(numberOfImages / 2);
      if (newIndexBeginPhoto < 0) newIndexBeginPhoto = 0;

      const newIndexEndPhoto: number = newIndexBeginPhoto + numberOfImages;

      const result = checkLimits(newIndexBeginPhoto, newIndexEndPhoto, numberOfImages);

      setIndexBeginPhoto(result.newIndexBeginPhoto);
      setIndexEndPhoto(result.newIndexEndPhoto);
    }
  }, [props.screenWidth, props.openDrawer, props.photos, computeNumberOfImages, checkLimits]);

  const selectPhotoHandler: (photo: Photo) => void = (photo: Photo) => {
    props.selectPhoto(photo);
  };

  let thumbsElem;
  let buttonPrev;
  let buttonNext;

  const nextPhotos = () => {
    const numberOfImages: number = computeNumberOfImages(props.screenWidth);

    const newIndexBeginPhoto = indexEndPhoto + 1;
    const newIndexEndPhoto = newIndexBeginPhoto + numberOfImages;
    const result = checkLimits(newIndexBeginPhoto, newIndexEndPhoto, numberOfImages);

    setIndexBeginPhoto(result.newIndexBeginPhoto);
    setIndexEndPhoto(result.newIndexEndPhoto);
  };

  const previousPhotos = () => {
    const numberOfImages: number = computeNumberOfImages(props.screenWidth);
    let newIndexBeginPhoto = indexBeginPhoto - numberOfImages;
    if (newIndexBeginPhoto < 0) newIndexBeginPhoto = 0;
    const newIndexEndPhoto = newIndexBeginPhoto + numberOfImages;
    const result = checkLimits(newIndexBeginPhoto, newIndexEndPhoto, numberOfImages);

    setIndexBeginPhoto(result.newIndexBeginPhoto);
    setIndexEndPhoto(result.newIndexEndPhoto);
  };

  if (props.photos !== undefined && props.photos.length > 0 && indexBeginPhoto >= 0 && indexEndPhoto < props.photos.length) {
    const photosArrayShowed: Photo[] = [];
    for (let i: number = indexBeginPhoto; i <= indexEndPhoto; i++) {
      photosArrayShowed.push(props.photos[i]);
    }

    thumbsElem = photosArrayShowed.map((photo: Photo) => {
      return <Thumnail key={photo.id} photo={photo} selectPhoto={selectPhotoHandler} />;
    });

    buttonPrev = <NavButton onClick={() => previousPhotos()} previous={true} disabled={indexBeginPhoto === 0} />;

    buttonNext = <NavButton onClick={() => nextPhotos()} disabled={indexEndPhoto >= props.photos.length - 1} previous={false} />;
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
        {buttonPrev}
        {thumbsElem}
        {buttonNext}
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

export default connect(mapStateToProps, { selectPhoto, toggleDrawer })(ThumnailsGalery);
