import * as React from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import { withSize } from 'react-sizeme';
import { useHistory } from 'react-router-dom';

import { AppState } from '../../../store';
import { Album } from '../../../types/Album';
import { newAlbumSelected } from '../../../store/photo/actions';
import { drawerWidthChanged } from '../../../store/drawer/actions';
import Alert from '@material-ui/lab/Alert';
import { Grow } from '@material-ui/core';
import { AlbumsHash } from './DrawerInterface';
import { AlbumLeaf } from './AlbumLeaf';
import { ROUTE_IMAGES } from '../../../utils/routesUtils';
import { isSonSelectedRecurs } from '../../../store/album/utils';

interface DrawerAlbumsProps {
  albums: Album[];
  newAlbumSelected: typeof newAlbumSelected;
  drawerWidthChanged: typeof drawerWidthChanged;
  albumIdSelected: number;
  size: any;
}

const recursAlbumOpen = (album: Album, finalObject: AlbumsHash, albumIdSelected: number) => {
  finalObject[album.id] = isSonSelectedRecurs(album.sons, albumIdSelected);
  album.sons.forEach(son => {
    recursAlbumOpen(son, finalObject, albumIdSelected);
  });
};

const DrawerAlbums: React.FC<DrawerAlbumsProps> = props => {
  const [albumsHash, setAlbumsHash] = React.useState({} as AlbumsHash);
  const history = useHistory();
  const { albums, albumIdSelected } = props;

  useEffect(() => {
    const newAlbumHash: AlbumsHash = {};
    albums.forEach((album: Album) => {
      recursAlbumOpen(album, newAlbumHash, albumIdSelected);
    });

    setAlbumsHash(newAlbumHash);
  }, [albums, albumIdSelected]);

  useEffect(() => {
    props.drawerWidthChanged(Math.trunc(props.size.width));
  }, [props, props.size.width]);

  const toggleAlbumHash = (idAlbum: number) => {
    const newAlbumHash = { ...albumsHash };
    newAlbumHash[idAlbum] = !albumsHash[idAlbum];
    setAlbumsHash(newAlbumHash);
  };

  const handleListAlbumClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, album: Album, toggleAlbum: boolean) => {
    event.stopPropagation();
    if (toggleAlbum) {
      toggleAlbumHash(album.id);
    } else {
      history.push(`${ROUTE_IMAGES}?albumId=${album.id}`);
    }
  };

  let listRootElem;
  if (props.albums.length > 0) {
    listRootElem = (
      <List>
        {props.albums.map(album => {
          return (
            <AlbumLeaf
              key={album.id}
              album={album}
              albumsHash={albumsHash}
              nestedIndex={1}
              albumIdSelected={props.albumIdSelected}
              handleListAlbumClick={handleListAlbumClick}
            />
          );
        })}
      </List>
    );
  }

  return (
    <div>
      {listRootElem}
      <Grow in={!props.albums || props.albums.length === 0}>
        <Alert severity='error'>No albums available</Alert>
      </Grow>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  albums: state.albums.imageAlbumsTree,
  albumIdSelected: state.albums.albumImageIdSelected,
});

export default withSize()(connect(mapStateToProps, { newAlbumSelected, drawerWidthChanged })(DrawerAlbums));
