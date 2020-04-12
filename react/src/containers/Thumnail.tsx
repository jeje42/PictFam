import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Photo } from '../types/Photo';
import MyImgElement from './MyImgElement';

interface ThumnailProps {
  photo: Photo;
  selectPhoto: (photo: Photo) => void;
}

const useStyles = makeStyles(() => ({
  divContainer: {
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.5,
    },
  },
  divContainerSelected: {
    backgroundColor: 'green',
  },
}));

const Thumnail: React.FC<ThumnailProps> = props => {
  const classes = useStyles();

  const classesDiv = [classes.divContainer];
  if (props.photo.selected) {
    classesDiv.push(classes.divContainerSelected);
  }

  const imgStyle = {
    margin: '10px',
    borderRadius: '5px',
    width: '100px',
    height: '56px',
  };

  const imgElem = <MyImgElement imgUrl={`thumnail/${props.photo.id}`} styleRaw={imgStyle} />;

  return (
    <div onClick={() => props.selectPhoto(props.photo)} className={classesDiv.join(' ')}>
      {imgElem}
    </div>
  );
};

export default Thumnail;
