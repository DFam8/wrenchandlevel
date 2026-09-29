// Business details from the handoff's "Content to fill in" list.
// Leave a value null (or a list empty) until it's real: anything that reads it stays hidden.
export const site = {
  name: 'Wrench & Level',
  tagline: 'Home fixes and car care, evenings and weekends.',
  area: 'Dubuque',
  ownerName: 'Luke',
  yearsInstalling: null as number | null,
  phone: '563-580-7440' as string | null,
  email: 'luke@wrenchandlevel.com' as string | null,
  // Each town needs a position in src/data/map.ts for the About page map.
  towns: ['Asbury', 'Peosta', 'Epworth', 'Sherrill', 'Farley', 'East Dubuque, IL'] as string[],
  insurance: null as string | null,
  // Cal.com username, set once the account exists (e.g. "wrenchandlevel").
  calUsername: 'wrenchandlevel' as string | null,
};

// Put files in public/photos/ and set the path, e.g. '/photos/hero.jpg'.
// A null photo shows a dashed placeholder in `npm run dev` and is left out of the built site.
export const photos = {
  hero: null as string | null, // a clean TV install or brake job you did
  tv: null as string | null, // a mounted TV with no cords showing
  hanging: null as string | null, // floating shelves or a gallery wall
  furniture: null as string | null, // an assembled dresser or bed frame
  oddJobs: null as string | null, // you at work, tools out
  brakes: null as string | null, // a caliper and new rotor mid-job
  about: null as string | null, // you, ideally with your tools or truck
};

// Real customer reviews only. The section stays off until there are some.
export const reviews: { quote: string; name: string }[] = [];

export const nav = [
  { href: '/home-services', label: 'Home Services' },
  { href: '/auto-services', label: 'Auto Services' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
];
