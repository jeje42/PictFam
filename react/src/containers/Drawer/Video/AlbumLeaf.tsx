import { Album } from '../../../types/Album';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import * as React from 'react';

interface AlbumLeafProps {
  album: Album;
  albumIdSelected: number;
  handleListAlbumClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, album: Album) => void;
}

/**
 * Used to generate an album tree in the drawer.
 *  - Generates the item (variable item)
 *  - if the album has sons, generates collapse and the nested by calling generateAlbumLeaf recursively.
 **/
const AlbumLeaf: React.FC<AlbumLeafProps> = props => {
  const item = (
    <ListItem
      key={props.album.id}
      button
      onClick={(event: any) => props.handleListAlbumClick(event, props.album)}
      selected={props.albumIdSelected === props.album.id}
    >
      <ListItemText primary={props.album.name} />
    </ListItem>
  );

  return <div>{item}</div>;
};

export { AlbumLeaf };
