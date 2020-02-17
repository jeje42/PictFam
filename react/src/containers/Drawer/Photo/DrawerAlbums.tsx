import * as React from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import { withSize } from 'react-sizeme';
import { AppState } from '../../../store';
import { Album } from '../../../types/Album';
import { selectAlbumImage } from '../../../store/album/actions';
import { newAlbumSelected } from '../../../store/photo/actions';
import { drawerWidthChanged } from '../../../store/drawer/actions';
import Alert from '@material-ui/lab/Alert';
import { Grow } from '@material-ui/core';
import { AlbumsHash } from './DrawerInterface';
import { AlbumLeaf } from './AlbumLeaf';

interface DrawerAlbumsProps {
  albums: Album[];
  selectAlbumImage: typeof selectAlbumImage;
  newAlbumSelected: typeof newAlbumSelected;
  drawerWidthChanged: typeof drawerWidthChanged;
  albumIdSelected: number;
  size: any;
}

const recursAlbumOpen = (album: Album, finalObject: AlbumsHash) => {
  finalObject[album.id] = false;
  album.sons.forEach(son => {
    recursAlbumOpen(son, finalObject);
  });
};

const generateAlbumListRecurs = (album: Album, finalList: Album[]) => {
  album.sons.forEach(album => {
    finalList.push(album);
    generateAlbumListRecurs(album, finalList);
  });
};

const DrawerAlbums: React.FC<DrawerAlbumsProps> = props => {
  const [albumsHash, setAlbumsHash] = React.useState({} as AlbumsHash);

  useEffect(() => {
    const newAlbumHash: AlbumsHash = {};
    props.albums.forEach((album: Album) => {
      recursAlbumOpen(album, newAlbumHash);
    });

    setAlbumsHash(newAlbumHash);
  }, [props.albums]);

  useEffect(() => {
    props.drawerWidthChanged(Math.trunc(props.size.width));
  }, [props, props.size.width]);

  const toggleAlbumHash = (idAlbum: number) => {
    const newAlbumHash = { ...albumsHash };
    newAlbumHash[idAlbum] = !albumsHash[idAlbum];
    setAlbumsHash(newAlbumHash);
  };

  const handleListAlbumClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, album: Album, toggleAlbum: boolean) => {
    if (toggleAlbum) {
      event.stopPropagation();
      toggleAlbumHash(album.id);
    } else {
      props.selectAlbumImage(album);
      const albums = [album] as Album[];
      generateAlbumListRecurs(album, albums);
      props.newAlbumSelected(albums);
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
  albums: state.albums.albumsImage,
  albumIdSelected: state.albums.albumImageIdSelected,
});

export default withSize()(connect(mapStateToProps, { selectAlbumImage, newAlbumSelected, drawerWidthChanged })(DrawerAlbums));
