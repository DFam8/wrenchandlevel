import { site } from './site';
import { addOn, markup, tripFee, money } from '../lib/prices';

const towns = site.towns.length ? `: ${site.towns.join(', ')}` : '';

type Item = { id: string; q: string; a: string };

const items = (list: (Item | null)[]) => list.filter((x): x is Item => x !== null);

export const faq = [
  {
    id: 'booking',
    title: 'Booking and payment',
    items: items([
      {
        id: 'when',
        q: 'When are you available?',
        a: 'Weekday evenings and weekends. Open slots show up when you book, and longer jobs block out the time after them so nothing gets rushed.',
      },
      {
        id: 'pay',
        q: 'How do I pay?',
        a: "After the job is done and you're happy with it. Venmo, Cash App, card or cash. No deposits.",
      },
      {
        id: 'area',
        q: 'What area do you cover?',
        a: `${site.area} and the surrounding area${towns}. Not sure if you're in range? Text me your address.`,
      },
      {
        id: 'change',
        q: 'Can I reschedule or cancel?',
        a: 'Yes. Just reply to your confirmation text. A heads up the day before is appreciated.',
      },
    ]),
  },
  {
    id: 'parts',
    title: 'Parts',
    items: items([
      {
        id: 'who',
        q: 'Do you bring the parts?',
        a: `For brake jobs, send your VIN when you book and I buy the exact parts before I come, billed at ${markup}. For TV mounts I can bring a bracket the same way.`,
      },
      {
        id: 'own',
        q: 'Can I buy my own parts?',
        a: `Sure. Send the part number or a photo of the box when you book and I'll check the fit. If the parts are missing or wrong when I get there, there's a ${tripFee} trip fee.`,
      },
      {
        id: 'quality',
        q: 'What brands do you use?',
        a: 'Quality aftermarket or OEM-equivalent parts from local parts stores. If you want a specific brand, note it when you book.',
      },
    ]),
  },
  {
    id: 'work',
    title: 'The work',
    items: items([
      {
        id: 'guarantee',
        q: "What's the 90-day guarantee?",
        a: "If something I did isn't right within 90 days, I come back and fix it free. Parts also carry their own manufacturer warranty.",
      },
      {
        id: 'tough',
        q: 'What if you find a bigger problem than I booked?',
        a: "I'll show you what I found, and you won't pay for the visit. Then it's your call: I can quote the fix if it's something I do, or point you to a good shop. Any parts I picked up go back to the store, not on your bill. If your car isn't safe to drive, I'll tell you plainly.",
      },
      {
        id: 'home',
        q: 'Do I need to be home?',
        a: 'For home jobs, yes. For brake jobs in your driveway, just be reachable by text and leave me the keys.',
      },
      site.insurance ? { id: 'insured', q: 'Are you insured?', a: site.insurance } : null,
      {
        id: 'dont',
        q: "What don't you do?",
        a: "Anything that needs a licensed pro, like electrical or plumbing, plus bigger car repairs like engine, transmission or electrical diagnosis. I'll point you to someone good.",
      },
      {
        id: 'bundle',
        q: 'Can I bundle jobs?',
        a: `Yes, and it saves you money. Extra hanging items are ${money(addOn('hanging', 'additional-item'))} each, a second TV is ${money(addOn('tv-mounting', 'extra-tv'))}, and an oil change is +${money(addOn('brake-pads-1-axle', 'oil-change'))} with any brake job.`,
      },
    ]),
  },
];

/** The question open when the page loads, as in the design. */
export const openByDefault = 'guarantee';
