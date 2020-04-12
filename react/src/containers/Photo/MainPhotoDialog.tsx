import React, { useEffect } from 'react';
import { Photo } from '../../types/Photo';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { connect } from 'react-redux';
import MyImgElement from '../MyImgElement';
import { withSize } from 'react-sizeme';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import NavButton from '../NavButton';
import Fab from '@material-ui/core/Fab';
import { Close } from '@material-ui/icons';
import { selectNextPhoto, selectPreviousPhoto } from '../../store/photo/actions';

interface MainPhotoDialogProps {
  photo?: Photo;
  size: any;
  selectNextPhoto: typeof selectNextPhoto;
  selectPreviousPhoto: typeof selectPreviousPhoto;
}

const computeImageHeight = (screenHeight?: number): number => {
  if (screenHeight === undefined) {
    return 400;
  }

  return screenHeight - 150;
};

const computeImageWidth = (screenWidth: number): number => {
  if (screenWidth === undefined) {
    return 711;
  }

  return screenWidth - 100;
};

const MainPhotoDialog: React.FC<MainPhotoDialogProps> = props => {
  const [open, setOpen] = React.useState(false);

  const imageHeight = computeImageHeight(props.size.height);
  const imageWidth = computeImageWidth(props.size.width);

  const classes = makeStyles((theme: any) =>
    createStyles({
      content: {
        textAlign: 'center',
      },
      buttonPrevious: {
        position: 'absolute',
        left: '50px',
        top: '50%',
        'z-index': '100000',
      },
      buttonNext: {
        position: 'absolute',
        right: '50px',
        top: '50%',
        'z-index': '100000',
      },
      buttonCloseModal: {
        position: 'absolute',
        right: '50px',
        top: '30px',
        'z-index': '100000',
      },
      modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
    }),
  )();

  const handleClose = () => {
    setOpen(false);
  };

  const { photo } = props;
  useEffect(() => {
    if (photo) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [photo]);

  const imgStyle = {
    width: `${imageWidth}px`,
    height: `${imageHeight}px`,
    objectFit: 'contain',
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby='draggable-dialog-title' fullWidth={true} maxWidth={false}>
      <DialogTitle style={{ cursor: 'move', textAlign: 'center' }} id='draggable-dialog-title'>
        {photo?.name} - {photo?.album.name}
      </DialogTitle>
      <DialogContent className={classes.content}>
        <div className={classes.buttonPrevious}>
          <NavButton onClick={() => props.selectPreviousPhoto()} previous={true} disabled={false} />
        </div>
        <div className={classes.buttonNext}>
          <NavButton onClick={() => props.selectNextPhoto()} previous={false} disabled={false} />
        </div>
        <div className={classes.buttonCloseModal}>
          <Fab color='secondary' aria-label='add' onClick={() => setOpen(false)}>
            <Close />
          </Fab>
        </div>
        <MyImgElement
          key={photo!.id}
          imgUrl={`photo/${photo!.id}`}
          styleRaw={{
            ...imgStyle,
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default withSize({ monitorHeight: true })(connect(() => ({}), { selectNextPhoto, selectPreviousPhoto })(MainPhotoDialog));
