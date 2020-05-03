import { Module } from '../store/app/types';
import { AppState } from '../store';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import * as React from 'react';
import { useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Playlist } from '../types/Playlist';

interface MyBackdropProps {
  currentModule: Module;
  albumImageIdSelected: number;
  albumVideoIdSelected: number;
  playlists: Playlist[];
}

const useStyles = makeStyles((theme: any) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer - 1,
      color: '#fff',
    },
  }),
);

const MyBackdrop: React.FC<MyBackdropProps> = props => {
  const classes = useStyles();
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  useEffect(() => {
    const albumIdSelected = props.currentModule === Module.Image ? props.albumImageIdSelected : props.albumVideoIdSelected;

    if (albumIdSelected !== -1) {
      setOpenBackdrop(false);
    } else {
      const playlistSelected = props.playlists.find(playlist => playlist.selected);

      if (playlistSelected) {
        setOpenBackdrop(false);
      } else {
        setOpenBackdrop(true);
      }
    }
  }, [props.albumImageIdSelected, props.currentModule, props.albumVideoIdSelected, props.playlists]);

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };

  return (
    <Backdrop className={classes.backdrop} open={openBackdrop} onClick={handleCloseBackdrop}>
      <CircularProgress color='secondary' />
    </Backdrop>
  );
};

const mapStateToProps = (state: AppState) => ({
  albumImageIdSelected: state.albums.albumImageIdSelected,
  albumVideoIdSelected: state.albums.albumVideoIdSelected,
  playlists: state.playlists.playlists,
  currentModule: state.app.module,
});

export default connect(mapStateToProps, {})(MyBackdrop);
