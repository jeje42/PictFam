import React, { useRef } from 'react';
import { VideoModule } from '../../store/app/types';
import { Checkbox, ListItem, ListItemIcon, ListItemText, Tooltip } from '@material-ui/core';
import { Add, Delete } from '@material-ui/icons';
import { ROUTE_VIDEOS } from '../../utils/routesUtils';
import MyImgElement from '../MyImgElement';
import { Video } from '../../types/Video';
import { useHistory } from 'react-router-dom';
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from 'react-dnd';
import { ItemTypes } from './dragAndDrop';

interface VideoListItemProps {
  index: number;
  video: Video;
  selectMode: boolean;
  albumOrPlaylistId: string;
  videoModule: VideoModule;
  selectModeVideoIndexes: number[];
  videoReading?: Video;
  removeVideoFromPlaylist: (index: number) => void;
  setVideoModalAddToPlaylist: (videoOrUndefined: Video[] | undefined) => void;
  setSelectModeVideoIndexes: (selectedVideoList: number[]) => void;
  moveVideoHovered?: (dragIndex: number, hoverIndex: number) => void;
  saveAfterDrop?: () => void;
}

const imageWidth = 10;

const imgStyle = {
  margin: '10px',
  borderRadius: '5px',
  width: `${imageWidth}em`,
  height: `${(imageWidth * 9) / 16}em`,
  transition: 'all 2s',
};

const VideoListItemFC: React.FC<VideoListItemProps> = props => {
  const {
    video,
    index,
    selectMode,
    albumOrPlaylistId,
    videoModule,
    videoReading,
    selectModeVideoIndexes,
    setVideoModalAddToPlaylist,
    setSelectModeVideoIndexes,
  } = props;

  const history = useHistory();

  const ref = useRef(null);
  const [{ isDragging }, connectDrag] = useDrag({
    item: { video, type: ItemTypes.VIDEO, index },
    collect: (monitor: any) => {
      const result = {
        isDragging: monitor.isDragging(),
      };
      return result;
    },
  });

  const [, connectDrop] = useDrop({
    accept: ItemTypes.VIDEO,
    hover(item: { video: Video; type: string; index: number }, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }

      if (!props.moveVideoHovered) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      // @ts-ignore
      const hoverBoundingRect = ref.current!.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      props.moveVideoHovered(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    drop() {
      if (props.saveAfterDrop) {
        props.saveAfterDrop();
      }
    },
  });

  connectDrag(ref);
  connectDrop(ref);

  let addOrDeleteButton;
  let selectionCheckbox;
  if (videoModule === VideoModule.Video) {
    addOrDeleteButton = (
      <ListItemIcon>
        <Tooltip title={`Ajouter à la playlist`}>
          <Add
            onClick={(e: any) => {
              e.stopPropagation();
              setVideoModalAddToPlaylist([video]);
            }}
          />
        </Tooltip>
      </ListItemIcon>
    );

    const selectedVideoIndex = selectModeVideoIndexes.indexOf(index);
    if (selectMode) {
      selectionCheckbox = (
        <Tooltip title={`${selectedVideoIndex === -1 ? 'Sélectionner la video' : 'Déselectionner la video'}`}>
          <Checkbox
            checked={selectedVideoIndex !== -1}
            onClick={(e: any) => {
              e.stopPropagation();
            }}
            onChange={(e: any) => {
              if (selectedVideoIndex === -1) {
                setSelectModeVideoIndexes(selectModeVideoIndexes.concat(index));
              } else {
                setSelectModeVideoIndexes(selectModeVideoIndexes.filter((index: number) => index !== selectedVideoIndex));
              }
            }}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        </Tooltip>
      );
    }
  } else {
    addOrDeleteButton = (
      <ListItemIcon>
        <Tooltip title={`Retirer de la playlist`}>
          <Delete
            onClick={(e: any) => {
              e.stopPropagation();
              props.removeVideoFromPlaylist(props.index);
            }}
          />
        </Tooltip>
      </ListItemIcon>
    );

    const selectedVideoIndex = selectModeVideoIndexes.indexOf(index);
    if (selectMode) {
      selectionCheckbox = (
        <Tooltip title={`${selectedVideoIndex === -1 ? 'Sélectionner la video' : 'Déselectionner la video'}`}>
          <Checkbox
            checked={selectedVideoIndex !== -1}
            onClick={(e: any) => {
              e.stopPropagation();
            }}
            onChange={(e: any) => {
              if (selectedVideoIndex === -1) {
                setSelectModeVideoIndexes(selectModeVideoIndexes.concat(index));
              } else {
                setSelectModeVideoIndexes(selectModeVideoIndexes.filter((index: number) => index !== selectedVideoIndex));
              }
            }}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        </Tooltip>
      );
    }
  }

  return (
    <ListItem
      key={video.id}
      button={true}
      onClick={() => history.push(`${ROUTE_VIDEOS}?${albumOrPlaylistId}&videoId=${video.id}`)}
      selected={videoReading && videoReading === video}
      style={{ opacity: `${isDragging ? 0 : 1}` }}
      ref={ref}
    >
      <MyImgElement
        key={video.id}
        imgUrl={`thumnailVideo/${video.id}`}
        styleRaw={{
          ...imgStyle,
        }}
      />
      <ListItemText primary={video.name} secondary={video.name} />
      {selectionCheckbox}
      {addOrDeleteButton}
    </ListItem>
  );
};

export default VideoListItemFC;
