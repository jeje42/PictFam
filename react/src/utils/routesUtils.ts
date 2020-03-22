import { useLocation } from 'react-router-dom';

export const ROUTE_IMAGES = '/images';
export const ROUTE_VIDEOS = '/videos';

// A custom hook that builds on useLocation to parse
// the query string for you.
export function useQuery() {
  return new URLSearchParams(useLocation().search);
}
