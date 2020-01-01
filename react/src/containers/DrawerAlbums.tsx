import * as React from "react"
import {useEffect} from "react"
import { connect } from 'react-redux'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import { AppState } from '../store/index'
import { AlbumState } from '../store/album/types'
import { Album } from "../types/Album";


interface DrawerAlbumsProps {
  albums: Array<Album>,
}

interface AlbumsHash {
  [id: number]: boolean
}

const useStyles = makeStyles((theme: any) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }),
)

const recursAlbumOpen = (album: Album, finalObject: AlbumsHash) => {
  finalObject[album.id] = false
  album.sons.forEach(son => {
    recursAlbumOpen(son, finalObject)
  })
}

const DrawerAlbums: React.SFC<DrawerAlbumsProps> = (props) => {
  const [albumsHash, setAlbumsHash] = React.useState({} as AlbumsHash)
  const classes = useStyles()

  const toggleAlbumHash = (idAlbum: number) => {
    let newAlbumHash = {...albumsHash}
    newAlbumHash[idAlbum] = !albumsHash[idAlbum]
    setAlbumsHash(newAlbumHash)
  }

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
        onClick={() => toggleAlbumHash(album.id)}
        >
        <ListItemText primary={album.name} />
        {albumHasSons?(albumsHash[album.id] ? <ExpandLess /> : <ExpandMore />):null}
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

  return (
    <div>
      {listRootElem}
    </div>
  )
}

const mapStateToProps = (state: AppState) => ({
  albums: state.albums.albums,
})

export default connect(
  mapStateToProps,
  {
  }
)(DrawerAlbums)
