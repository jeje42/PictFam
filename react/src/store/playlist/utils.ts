import { Playlist } from '../../types/Playlist';
import { PlaylistFetched } from './types';
import { Video } from '../../types/Video';

interface PlayListForPost {
  playlist: Playlist;
  videos: Video[];
}

export const transformPlaylistToPlaylistForBackend = (playlist: Playlist): PlayListForPost => ({
  playlist,
  videos: playlist.videos,
});
