import * as React from 'react';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import { withSize } from 'react-sizeme';
import { AppState } from '../../../store';
import { Album } from '../../../types/Album';
import { selectAlbumVideo } from '../../../store/album/actions';
import { newAlbumSelected } from '../../../store/video/actions';
import { drawerWidthChanged } from '../../../store/drawer/actions';
import Alert from '@material-ui/lab/Alert';
import { Collapse } from '@material-ui/core';
import { DrawerLeaf } from './DrawerLeaf';
import { ROUTE_VIDEOS } from '../../../utils/routesUtils';
import { useHistory } from 'react-router-dom';
import { ExpandMore } from '@material-ui/icons';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ListItem from '@material-ui/core/ListItem';

interface DrawerAlbumsProps {
  albums: Album[];
  selectAlbumVideo: typeof selectAlbumVideo;
  newAlbumSelected: typeof newAlbumSelected;
  drawerWidthChanged: typeof drawerWidthChanged;
  albumIdSelected: number;
  size: any;
}

const recursBuildListAlbums = (album: Album, finalList: Album[]) => {
  if (album.sons) {
    album.sons.forEach(son => finalList.push(son));
    album.sons.forEach(son => recursBuildListAlbums(son, finalList));
  }
};

const generateAlbumListRecurs = (album: Album, finalList: Album[]) => {
  album.sons.forEach(album => {
    finalList.push(album);
    generateAlbumListRecurs(album, finalList);
  });
};

const DrawerAlbums: React.FC<DrawerAlbumsProps> = props => {
  const [albumListDisplayed, setAlbumListDisplayed] = useState<Album[]>([]);
  const [albumsDeployed, setAlbumsDeployed] = useState<boolean>(false);
  const [playlistsDeployed, setPlaylistsDeployed] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    props.drawerWidthChanged(Math.trunc(props.size.width));
  }, [props, props.size.width]);

  useEffect(() => {
    if (props.albums) {
      const listAlbumsNew: Album[] = [];

      props.albums.forEach(alb => listAlbumsNew.push(alb));
      props.albums.forEach(alb => recursBuildListAlbums(alb, listAlbumsNew));
      setAlbumListDisplayed(listAlbumsNew);
    }
  }, [props.albums]);

  const handleListAlbumClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, album: Album) => {
    history.push(`${ROUTE_VIDEOS}?albumId=${album.id}`);
  };

  let listAlbums;
  if (props.albums.length > 0) {
    listAlbums = (
      <List>
        {albumListDisplayed.map(album => {
          return <DrawerLeaf key={album.id} album={album} nested={true} albumIdSelected={props.albumIdSelected} handleListAlbumClick={handleListAlbumClick} />;
        })}
      </List>
    );
  }

  let alertNoAlbum;
  if (!props.albums || props.albums.length === 0) {
    alertNoAlbum = <Alert severity='error'>No albums available</Alert>;
  }

  const alertNoPlaylist = <Alert severity='error'>No playlist available</Alert>;

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
      <Collapse in={playlistsDeployed}>{alertNoPlaylist}</Collapse>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  albums: state.albums.albumsVideo,
  albumIdSelected: state.albums.albumVideoIdSelected,
});

export default withSize()(connect(mapStateToProps, { selectAlbumVideo, newAlbumSelected, drawerWidthChanged })(DrawerAlbums));
