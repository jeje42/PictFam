// import cuid from 'cuid';
import { action } from 'typesafe-actions';

import { Photo } from '../../types/Photo'

import { PHOTOS_ADDED } from './types';

export const addPhotos = (photos: Array<Photo>) =>
  action(PHOTOS_ADDED, photos);
