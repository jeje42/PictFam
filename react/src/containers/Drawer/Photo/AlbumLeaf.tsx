import { Album } from '../../../types/Album';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import * as React from 'react';
import { AlbumsHash } from './DrawerInterface';
import { AppState } from '../../../store';
import { connect } from 'react-redux';

interface AlbumLeafProps {
  album: Album;
  expandedAlbumsHash: AlbumsHash;
  nestedIndex: number;
  albumIdSelected: number;
  imageParentAlbumsRecord: Record<number, Album[]>;
  handleListAlbumClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, album: Album, toggleAlbum: boolean) => void;
}

/**
 * Used to generate an album tree in the drawer.
 *  - Generates the item (variable item)
 *  - if the album has sons, generates collapse and the nested by calling generateAlbumLeaf recursively.
 **/
const AlbumLeafFC: React.FC<AlbumLeafProps> = props => {
  const localClasses = makeStyles((theme: any) =>
    createStyles({
      nested: {
        paddingLeft: props.nestedIndex * theme.spacing(4),
      },
    }),
  )();

  const { album, expandedAlbumsHash, imageParentAlbumsRecord } = props;

  const albumHasSons = imageParentAlbumsRecord[album.id] && imageParentAlbumsRecord[album.id].length > 0;

  const item = (
    <ListItem
      key={props.album.id}
      button
      className={localClasses.nested}
      onClick={(event: any) => props.handleListAlbumClick(event, props.album, false)}
      selected={props.albumIdSelected === props.album.id}
    >
      <ListItemText primary={props.album.name} />
      {albumHasSons ? (
        expandedAlbumsHash[props.album.id] ? (
          <ExpandLess onClick={(event: any) => props.handleListAlbumClick(event, props.album, true)} />
        ) : (
          <ExpandMore onClick={(event: any) => props.handleListAlbumClick(event, props.album, true)} />
        )
      ) : undefined}
    </ListItem>
  );
  let collapse;
  if (albumHasSons) {
    const sonsElem = imageParentAlbumsRecord[album.id].map(sonAlbum => {
      return (
        <AlbumLeafFC
          key={sonAlbum.id}
          album={sonAlbum}
          expandedAlbumsHash={expandedAlbumsHash}
          nestedIndex={props.nestedIndex + 1}
          albumIdSelected={props.albumIdSelected}
          handleListAlbumClick={props.handleListAlbumClick}
          imageParentAlbumsRecord={imageParentAlbumsRecord}
        />
      );
    });

    collapse = (
      <Collapse in={props.expandedAlbumsHash[props.album.id]} timeout='auto' unmountOnExit>
        <List component='div' disablePadding>
          {sonsElem}
        </List>
      </Collapse>
    );
  }

  return (
    <div>
      {item}
      {collapse}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  imageParentAlbumsRecord: state.albums.imageParentAlbumsRecord,
});

export default connect(mapStateToProps, {})(AlbumLeafFC);
