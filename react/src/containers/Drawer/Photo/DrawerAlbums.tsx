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

import { AppState } from '../../../store'
import { Album } from '../../../types/Album'
import { selectAlbumImage } from '../../../store/album/actions'
import { newAlbumSelected } from '../../../store/photo/actions'
import { drawerWidthChanged } from '../../../store/drawer/actions'
import Alert from "@material-ui/lab/Alert";
import {Grow} from "@material-ui/core";
import {AlbumsHash} from './DrawerInterface'
import {AlbumLeaf} from './AlbumLeaf'


interface DrawerAlbumsProps {
  albums: Array<Album>,
  selectAlbumImage: typeof selectAlbumImage,
  newAlbumSelected: typeof newAlbumSelected,
  drawerWidthChanged: typeof drawerWidthChanged,
  albumIdSelected: number,
  size: any,
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

const DrawerAlbums: React.FC<DrawerAlbumsProps> = (props) => {
  const [albumsHash, setAlbumsHash] = React.useState({} as AlbumsHash)

  useEffect( () => {
    let newAlbumHash: AlbumsHash = {}
    props.albums.forEach((album: Album) => {
      recursAlbumOpen(album, newAlbumHash)
    })

    setAlbumsHash(newAlbumHash)
  }, [])

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
      props.selectAlbumImage(album)
      let albums = [album] as Array<Album>
      generateAlbumListRecurs(album, albums)
      props.newAlbumSelected(albums)
    }
  };



  let listRootElem = null
  if (props.albums.length>0) {
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
          )
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
      <Grow in={!props.albums || props.albums.length === 0}>
        <Alert severity="error">No albums available</Alert>
      </Grow>
    </div>
  )
}

const mapStateToProps = (state: AppState) => ({
  albums: state.albums.albumsImage,
  albumIdSelected: state.albums.albumImageIdSelected
})

export default withSize()(connect(
  mapStateToProps,
  { selectAlbumImage, newAlbumSelected,
    drawerWidthChanged
  }
)(DrawerAlbums))
