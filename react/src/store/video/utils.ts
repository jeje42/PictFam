import { Album } from '../../types/Album';
import { Video, VideoFetched } from '../../types/Video';

export const videoFetchedToVideo = (videoFetched: VideoFetched, album: Album): Video => ({
  id: videoFetched.id,
  name: videoFetched.name,
  _links: videoFetched._links,
  selected: false,
  album,
});
