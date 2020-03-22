import { Album } from '../../types/Album';
import { findAlbumRecurs, isSonSelectedRecurs } from './utils';

const albums: Album[] = [
  {
    id: 0,
    isRoot: true,
    name: 'Root0 Album',
    sons: [
      {
        id: 1,
        isRoot: false,
        name: 'Son0 of Root0',
        sons: [],
      },
      {
        id: 2,
        isRoot: false,
        name: 'Son1 of Root1',
        sons: [
          {
            id: 3,
            isRoot: false,
            name: 'Son0 of Son1 of Root0',
            sons: [],
          },
        ],
      },
    ],
  },
];

test('findAlbumRecurs', () => {
  const result: Album | undefined = findAlbumRecurs(albums, 1);
  if (result) {
    expect(result.id).toBe(1);
  } else {
    expect(false).toBe(true);
  }
});

test('isSonSelectedRecurs, son in selected', () => {
  const result = isSonSelectedRecurs(albums, 2);
  expect(result).toBe(true);
});

test('isSonSelectedRecurs, son not in selected', () => {
  const result = isSonSelectedRecurs(albums, 1101);
  expect(result).toBe(false);
});
