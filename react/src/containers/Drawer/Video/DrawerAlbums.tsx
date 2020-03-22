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
import { Grow } from '@material-ui/core';
import { AlbumLeaf } from './AlbumLeaf';

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
    props.selectAlbumVideo(album.id);
    const albums = [album] as Album[];
    generateAlbumListRecurs(album, albums);
    props.newAlbumSelected(albums);
  };

  let listRootElem;
  if (props.albums.length > 0) {
    listRootElem = (
      <List>
        {albumListDisplayed.map(album => {
          return <AlbumLeaf key={album.id} album={album} albumIdSelected={props.albumIdSelected} handleListAlbumClick={handleListAlbumClick} />;
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
  albums: state.albums.albumsVideo,
  albumIdSelected: state.albums.albumVideoIdSelected,
});

export default withSize()(connect(mapStateToProps, { selectAlbumVideo, newAlbumSelected, drawerWidthChanged })(DrawerAlbums));
