import * as React from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import { withSize } from 'react-sizeme';
import { useHistory } from 'react-router-dom';

import { AppState } from '../../../store';
import { Album } from '../../../types/Album';
import { drawerWidthChanged } from '../../../store/drawer/actions';
import Alert from '@material-ui/lab/Alert';
import { Grow } from '@material-ui/core';
import { AlbumsHash } from './DrawerInterface';
import AlbumLeaf from './AlbumLeaf';
import { ROUTE_IMAGES } from '../../../utils/routesUtils';

interface DrawerAlbumsProps {
  imageAlbumsRecord: Record<number, Album>;
  imageParentAlbumsRecord: Record<number, Album[]>;
  numberOfAlbums: number;
  drawerWidthChanged: typeof drawerWidthChanged;
  albumIdSelected: number;
  size: any;
}

const DrawerAlbums: React.FC<DrawerAlbumsProps> = props => {
  const [expandedAlbumsHash, setExpandedAlbumsHash] = React.useState({} as AlbumsHash);
  const history = useHistory();
  const { imageAlbumsRecord, imageParentAlbumsRecord, albumIdSelected } = props;

  useEffect(() => {
    const defineOpenedAlbumsRecurs = (newAlbumHash: AlbumsHash, albumId: number) => {
      const album = imageAlbumsRecord[albumId];
      if (!album) {
        return;
      }

      newAlbumHash[album.id] = true;

      if (album.parentId !== -1) {
        defineOpenedAlbumsRecurs(newAlbumHash, album.parentId);
      }
    };

    const newExpandedAlbumHash: AlbumsHash = {};
    defineOpenedAlbumsRecurs(newExpandedAlbumHash, albumIdSelected);

    setExpandedAlbumsHash(newExpandedAlbumHash);
  }, [imageAlbumsRecord, albumIdSelected]);

  useEffect(() => {
    props.drawerWidthChanged(Math.trunc(props.size.width));
  }, [props, props.size.width]);

  const toggleAlbumHash = (idAlbum: number, expandedAlbumsHash: AlbumsHash) => {
    const newExpandedAlbumsHash = { ...expandedAlbumsHash };
    newExpandedAlbumsHash[idAlbum] = !newExpandedAlbumsHash[idAlbum];
    return newExpandedAlbumsHash;
  };

  const handleListAlbumClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, album: Album, toggleAlbum: boolean) => {
    event.stopPropagation();
    if (toggleAlbum) {
      setExpandedAlbumsHash(prevState => toggleAlbumHash(album.id, prevState));
    } else {
      history.push(`${ROUTE_IMAGES}?albumId=${album.id}`);
    }
  };

  const rootAlbums = imageParentAlbumsRecord[-1];

  let listRootElem;
  if (rootAlbums && rootAlbums.length > 0) {
    listRootElem = (
      <List>
        {rootAlbums.map(album => {
          return (
            <AlbumLeaf
              key={album.id}
              album={album}
              expandedAlbumsHash={expandedAlbumsHash}
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
      <Grow in={!rootAlbums || rootAlbums.length === 0}>
        <Alert severity='error'>No albums available</Alert>
      </Grow>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  imageAlbumsRecord: state.albums.imageAlbumsRecord,
  imageParentAlbumsRecord: state.albums.imageParentAlbumsRecord,
  numberOfAlbums: Object.keys(state.albums.imageAlbumsRecord).length,
  albumIdSelected: state.albums.albumImageIdSelected,
});

export default withSize()(connect(mapStateToProps, { drawerWidthChanged })(DrawerAlbums));
