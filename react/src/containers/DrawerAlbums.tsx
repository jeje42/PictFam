import * as React from "react"
import {useEffect} from "react"
import { connect } from 'react-redux'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { withSize } from 'react-sizeme'

import { AppState } from '../store/index'
import { Album } from '../types/Album'
import { selectAlbum } from '../store/album/actions'
import { newAlbumSelected } from '../store/photo/actions'
import { drawerWidthChanged } from '../store/drawer/actions'


interface DrawerAlbumsProps {
  albums: Array<Album>,
  selectAlbum: typeof selectAlbum,
  newAlbumSelected: typeof newAlbumSelected,
  drawerWidthChanged: typeof drawerWidthChanged,
  albumIdSelected: number,
  size: any,
}

interface AlbumsHash {
  [id: number]: boolean
}

const recursAlbumOpen = (album: Album, finalObject: AlbumsHash) => {
  finalObject[album.id] = false
  album.sons.forEach(son => {
    recursAlbumOpen(son, finalObject)
  })
}

const generateAlbumListRecurs = (album: Album, finalList: Array<Album>) => {
  album.sons.forEach(album => {
    finalList.push(album)
    generateAlbumListRecurs(album, finalList)
  })
}

const DrawerAlbums: React.SFC<DrawerAlbumsProps> = (props) => {
  const [albumsHash, setAlbumsHash] = React.useState({} as AlbumsHash)

  useEffect(() => {
    props.drawerWidthChanged(Math.trunc(props.size.width))
  }, [props.size.width])

  const toggleAlbumHash = (idAlbum: number) => {
    let newAlbumHash = {...albumsHash}
    newAlbumHash[idAlbum] = !albumsHash[idAlbum]
    setAlbumsHash(newAlbumHash)
  }

  const handleListAlbumClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    album: Album,
    toggleAlbum: boolean
  ) => {
    if (toggleAlbum) {
      event.stopPropagation()
      toggleAlbumHash(album.id)
    } else {
      props.selectAlbum(album)
      let albums = [album] as Array<Album>
      generateAlbumListRecurs(album, albums)
      props.newAlbumSelected(albums)
    }
  };

  /**
   * Used to generate an album tree in the drawer.
   *  - Generates the item (variable item)
   *  - if the album has sons, generates collapse and the nested by calling generateAlbumLeaf recursively.
   **/
  const generateAlbumLeaf = (album: Album, albumsHash: AlbumsHash, nestedIndex: number) => {
    const useStyles = makeStyles((theme: any) =>
      createStyles({
        nested: {
          paddingLeft: nestedIndex * theme.spacing(4),
        },
      }),
    )
    const localClasses = useStyles()

    const albumHasSons = album.sons && album.sons.length

    let item = (
      <ListItem
        key={album.id}
        button
        className={localClasses.nested}
        onClick={(event: any) => handleListAlbumClick(event, album, false)}
        selected={props.albumIdSelected === album.id}
        >
        <ListItemText primary={album.name} />
        {albumHasSons?(albumsHash[album.id] ?
          <ExpandLess onClick={(event: any) => handleListAlbumClick(event, album, true)} /> :
          <ExpandMore onClick={(event: any) => handleListAlbumClick(event, album, true)}/>):null}
      </ListItem>
    )
    let collapse = null
    if (albumHasSons > 0) {
      let sonsElem = album.sons.map(albumSon => {
        return generateAlbumLeaf(albumSon, albumsHash, nestedIndex+1)
      })

      collapse = (
        <Collapse in={albumsHash[album.id]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {sonsElem}
          </List>
        </Collapse>
      )
    }

    return (
      <div>
        {item}
        {collapse}
      </div>
    )
  }

  useEffect( () => {
    let newAlbumHash: AlbumsHash = {}
    props.albums.forEach((album: Album) => {
      recursAlbumOpen(album, newAlbumHash)
    })

    setAlbumsHash(newAlbumHash)
  }, [])

  let listRootElem = null
  if (props.albums.length>0) {
    listRootElem = (
      <List>
        {props.albums.map(album => {
          return generateAlbumLeaf(album, albumsHash, 1)
          })}
      </List>
    )
  }

  const useStyles = makeStyles((theme: any) =>
    createStyles({
      // @ts-ignore
      dragger: {
        width: '5px',
        cursor: 'ew-resize',
        padding: '4px 0 0',
        borderTop: '1px solid #ddd',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: '100',
        backgroundColor: '#f4f7f9'
      }
    }),
  )

  return (
    <div>
      {listRootElem}
    </div>
  )
}

const mapStateToProps = (state: AppState) => ({
  albums: state.albums.albums,
  albumIdSelected: state.albums.albumIdSelected
})

export default withSize()(connect(
  mapStateToProps,
  { selectAlbum, newAlbumSelected,
    drawerWidthChanged
  }
)(DrawerAlbums))
