// Where each town sits on the About page map. Add a line here when you add a town
// to `site.towns`, or the build stops and names the missing town.
// `label` is which side of the dot the name goes on.

export type LabelSide = 'left' | 'right' | 'above' | 'below';

export interface Place {
  lat: number;
  lon: number;
  label: LabelSide;
}

export const places: Record<string, Place> = {
  Dubuque: { lat: 42.5006, lon: -90.6646, label: 'left' },
  Asbury: { lat: 42.5145, lon: -90.7515, label: 'above' },
  Peosta: { lat: 42.4506, lon: -90.8507, label: 'below' },
  Epworth: { lat: 42.4453, lon: -90.9321, label: 'above' },
  Sherrill: { lat: 42.6061, lon: -90.7818, label: 'right' },
  Farley: { lat: 42.4428, lon: -91.0062, label: 'below' },
  'East Dubuque, IL': { lat: 42.4922, lon: -90.6429, label: 'right' },
};

// The Mississippi, north to south, simplified. It's the Iowa line on the east.
export const river: [lat: number, lon: number][] = [
  [42.72, -91.0],
  [42.67, -90.92],
  [42.645, -90.84],
  [42.62, -90.75],
  [42.58, -90.685],
  [42.54, -90.657],
  [42.5, -90.652],
  [42.47, -90.64],
  [42.43, -90.598],
  [42.39, -90.55],
  [42.33, -90.48],
];

// The Illinois / Wisconsin line runs east from the river along this latitude.
export const ilWiLine = 42.5;

// The part of the world the map shows.
export const bounds = { north: 42.67, south: 42.37, west: -91.1, east: -90.48 };
