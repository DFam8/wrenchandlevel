// Business details from the handoff's "Content to fill in" list.
// Leave a value null until it's real: anything that reads it stays hidden.
export const site = {
  name: 'Wrench & Level',
  ownerName: null as string | null,
  phone: null as string | null,
  email: null as string | null,
  towns: [] as string[],
  insurance: null as string | null,
  // Cal.com username, set once the account exists (e.g. "wrenchandlevel").
  calUsername: null as string | null,
};

export const nav = [
  { href: '/home-services', label: 'Home' },
  { href: '/auto-services', label: 'Auto' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
];
