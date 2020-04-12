import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { AppState } from '../store';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import clsx from 'clsx';
import { toggleDrawer } from '../store/drawer/actions';
import { Photo } from '../types/Photo';

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
  const classesDrawer = useStylesDrawer();

  return (
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
