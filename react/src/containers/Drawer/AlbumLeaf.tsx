import {Album} from "../../types/Album";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import * as React from "react";
import {AlbumsHash} from './DrawerInterface'

interface AlbumLeafProps {
    album: Album,
    albumsHash: AlbumsHash,
    nestedIndex: number,
    albumIdSelected: number,
    handleListAlbumClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, album: Album, toggleAlbum: boolean) => void
}

/**
 * Used to generate an album tree in the drawer.
 *  - Generates the item (variable item)
 *  - if the album has sons, generates collapse and the nested by calling generateAlbumLeaf recursively.
 **/
const AlbumLeaf: React.FC<AlbumLeafProps> = props => {
    const useStyles = makeStyles((theme: any) =>
        createStyles({
            nested: {
                paddingLeft: props.nestedIndex * theme.spacing(4),
            },
        }),
    )

    const localClasses = useStyles()

    const albumHasSons = props.album.sons && props.album.sons.length

    let item = (
        <ListItem
            key={props.album.id}
            button
            className={localClasses.nested}
            onClick={(event: any) => props.handleListAlbumClick(event, props.album, false)}
            selected={props.albumIdSelected === props.album.id}
        >
            <ListItemText primary={props.album.name} />
            {albumHasSons?(props.albumsHash[props.album.id] ?
                <ExpandLess onClick={(event: any) => props.handleListAlbumClick(event, props.album, true)} /> :
                <ExpandMore onClick={(event: any) => props.handleListAlbumClick(event, props.album, true)}/>):null}
        </ListItem>
    )
    let collapse = null
    if (albumHasSons > 0) {
        let sonsElem = props.album.sons.map(albumSon => {
            return (
                <AlbumLeaf
                    key={props.album.id}
                    album={albumSon}
                    albumsHash={props.albumsHash}
                    nestedIndex={props.nestedIndex+1}
                    albumIdSelected={props.albumIdSelected}
                    handleListAlbumClick={props.handleListAlbumClick}
                />
            )
        })

        collapse = (
            <Collapse in={props.albumsHash[props.album.id]} timeout="auto" unmountOnExit>
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

export {AlbumLeaf}