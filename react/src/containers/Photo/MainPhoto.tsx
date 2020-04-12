import * as React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { connect } from 'react-redux';

import { toggleDrawer } from '../../store/drawer/actions';
import { Photo } from '../../types/Photo';
import { AppState } from '../../store';
import MyImgElement from '../MyImgElement';
import { selectPhoto } from '../../store/photo/actions';
import { ROUTE_IMAGES } from '../../utils/routesUtils';
import { useHistory } from 'react-router-dom';
import MainPhotoDialog from './MainPhotoDialog';

interface MainPhotoProps {
  screenWidth: number;
  screenHeight: number;
  drawerWidth: number;
  openDrawer: boolean;
  photos: Photo[];
  albumIdSelected: number;
  selectPhoto: typeof selectPhoto;
}

const MainPhoto: React.FC<MainPhotoProps> = props => {
  const history = useHistory();

  if (props.photos.length === 0) {
    return <></>;
  }

  const selectPhotoHandler: (photo: Photo) => void = (photo: Photo) => {
    history.push(`${ROUTE_IMAGES}?albumId=${props.albumIdSelected}&photoId=${photo.id}`);
  };

  const classesDrawer = makeStyles((theme: any) =>
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
        alignContent: 'flex-start',
        flexWrap: 'wrap',
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
      },
    }),
  )();

  const imageWidth = 250;
  const imgStyle = {
    margin: '10px',
    borderRadius: '20px',
    width: `${imageWidth}px`,
    height: `${(imageWidth * 9) / 16}px`,
    cursor: 'pointer',
    transition: 'all 2s',
    '&:hover': {
      boxShadow: '5px 10px 18px #90EE90',
    },
  };
  const imgElem = (
    <>
      {props.photos.map(photo => (
        <div key={photo.id} onClick={() => selectPhotoHandler(photo)}>
          <MyImgElement
            key={photo.id}
            imgUrl={`thumnail/${photo.id}`}
            styleRaw={{
              ...imgStyle,
              boxShadow: `${photo.selected ? '5px 10px 18px yellow' : ''}`,
            }}
          />
        </div>
      ))}
    </>
  );

  const photoSelected = props.photos.find(photo => photo.selected);
  let dialog;
  if (photoSelected) {
    dialog = <MainPhotoDialog photo={photoSelected}></MainPhotoDialog>;
  }

  return (
    <div
      className={clsx(classesDrawer.content, {
        [classesDrawer.contentShift]: props.openDrawer,
      })}
    >
      {imgElem}
      {dialog}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  openDrawer: state.drawer.open,
  drawerWidth: state.drawer.width,
  photos: state.photos.photosSelected,
  albumIdSelected: state.albums.albumImageIdSelected,
});

export default connect(mapStateToProps, { toggleDrawer, selectPhoto })(MainPhoto);
