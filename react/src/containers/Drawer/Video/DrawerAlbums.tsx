import * as React from 'react';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import { withSize } from 'react-sizeme';
import { AppState } from '../../../store';
import { Album } from '../../../types/Album';
import { newAlbumSelected } from '../../../store/video/actions';
import { drawerWidthChanged } from '../../../store/drawer/actions';
import Alert from '@material-ui/lab/Alert';
import { Collapse, ListItemIcon } from '@material-ui/core';
import { DrawerLeaf } from './DrawerLeaf';
import { ROUTE_VIDEOS } from '../../../utils/routesUtils';
import { useHistory } from 'react-router-dom';
import { ExpandMore, Add } from '@material-ui/icons';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ListItem from '@material-ui/core/ListItem';
import DialogCreatePlaylist from './DialogCreatePlaylist';
import { Playlist } from '../../../types/Playlist';
import { selectPlaylist } from '../../../store/playlist/actions';

interface DrawerAlbumsProps {
  albums: Album[];
  playlists: Playlist[];
  newAlbumSelected: typeof newAlbumSelected;
  drawerWidthChanged: typeof drawerWidthChanged;
  selectPlaylist: typeof selectPlaylist;
  albumIdSelected: number;
  size: any;
}

const recursBuildListAlbums = (album: Album, finalList: Album[]) => {
  if (album.sons) {
    album.sons.forEach(son => finalList.push(son));
    album.sons.forEach(son => recursBuildListAlbums(son, finalList));
  }
};

const DrawerAlbums: React.FC<DrawerAlbumsProps> = ({ albums, playlists, albumIdSelected, size, drawerWidthChanged }) => {
  const [albumListDisplayed, setAlbumListDisplayed] = useState<Album[]>([]);
  const [albumsDeployed, setAlbumsDeployed] = useState<boolean>(false);
  const [playlistsDeployed, setPlaylistsDeployed] = useState<boolean>(false);
  const [openCreatePlaylistDialog, setOpenCreatePlaylistDialog] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    drawerWidthChanged(Math.trunc(size.width));
  }, [size.width, drawerWidthChanged]);

  useEffect(() => {
    if (albums) {
      const listAlbumsNew: Album[] = [];

      albums.forEach(alb => listAlbumsNew.push(alb));
      albums.forEach(alb => recursBuildListAlbums(alb, listAlbumsNew));
      setAlbumListDisplayed(listAlbumsNew);
    }
  }, [albums]);

  const handleListAlbumClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, album: Album) => {
    history.push(`${ROUTE_VIDEOS}?albumId=${album.id}`);
  };

  let listAlbums;
  if (albums.length > 0) {
    listAlbums = (
      <List>
        {albumListDisplayed.map(album => {
          return <DrawerLeaf key={album.id} album={album} nested={true} albumIdSelected={albumIdSelected} handleListAlbumClick={handleListAlbumClick} />;
        })}
      </List>
    );
  }

  let alertNoAlbum;
  if (!albums || albums.length === 0) {
    alertNoAlbum = <Alert severity='error'>No albums available</Alert>;
  }

  let dialogCreatePlaylist;
  if (openCreatePlaylistDialog) {
    const handleCloseCreatePlaylistDialog = () => {
      setOpenCreatePlaylistDialog(false);
    };
    dialogCreatePlaylist = <DialogCreatePlaylist handleClose={handleCloseCreatePlaylistDialog} />;
  }

  let listPlaylist;
  let alertNoPlaylist;
  if (playlistsDeployed) {
    if (playlists.length === 0) {
      alertNoPlaylist = <Alert severity='error'>No playlist available</Alert>;
    } else {
      listPlaylist = playlists.map(playlist => (
        <ListItem key={playlist.id} button selected={playlist.selected} onClick={() => history.push(`${ROUTE_VIDEOS}?playlistId=${playlist.id}`)}>
          <ListItemText primary={playlist.name} />
        </ListItem>
      ));
    }
  }

  const createPlaylist = (
    <ListItem key={'createPlaylist'} button onClick={() => setOpenCreatePlaylistDialog(true)}>
      <ListItemIcon>
        <Add />
      </ListItemIcon>
      <ListItemText primary={'Créer une playlist'} />
    </ListItem>
  );

  return (
    <div>
      <ListItem key={'videoAlbumExpansion'} button selected={albumsDeployed}>
        <ListItemText primary={'Albums'} />
        {albumsDeployed ? <ExpandLess onClick={() => setAlbumsDeployed(false)} /> : <ExpandMore onClick={() => setAlbumsDeployed(true)} />}
      </ListItem>
      <Collapse in={albumsDeployed}>
        {listAlbums}
        {alertNoAlbum}
      </Collapse>

      <ListItem key={'videoPlaylistExpansion'} button selected={playlistsDeployed}>
        <ListItemText primary={'Playlist'} />
        {playlistsDeployed ? <ExpandLess onClick={() => setPlaylistsDeployed(false)} /> : <ExpandMore onClick={() => setPlaylistsDeployed(true)} />}
      </ListItem>
      <Collapse in={playlistsDeployed}>
        {alertNoPlaylist}
        {listPlaylist}
        {createPlaylist}
        {dialogCreatePlaylist}
      </Collapse>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  albums: state.albums.videoAlbumsTree,
  albumIdSelected: state.albums.albumVideoIdSelected,
  playlists: state.playlists.playlists,
});

export default withSize()(connect(mapStateToProps, { newAlbumSelected, drawerWidthChanged, selectPlaylist })(DrawerAlbums));
