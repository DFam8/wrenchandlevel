// Booking logic for /book: which services can be booked, what the Parts step asks
// for each one, the summary lines, and the Cal.com prefill. Runs in the browser.
import prices from '../data/prices.json';
import { addOn, basePrice, markup, money, service, tierRange } from './prices';

export type Answers = Record<string, string>;

export interface BookableService {
  id: string;
  category: 'home' | 'auto';
  name: string;
  detail: string;
  price: string;
  time: string;
  /** Which Parts step fields apply. */
  parts: 'mount' | 'furniture' | 'odd' | 'brakes';
}

const time = (id: string) => {
  const hr = service(id).durationMin / 60;
  return `About ${Number.isInteger(hr) ? hr : hr.toFixed(1)} hr`;
};

const furniture = tierRange('furniture-assembly');

export const services: BookableService[] = [
  { id: 'tv-mounting', category: 'home', name: 'TV mounting', detail: 'Drywall, your bracket', price: money(basePrice('tv-mounting')), time: time('tv-mounting'), parts: 'mount' },
  { id: 'hanging', category: 'home', name: 'Shelves, art, mirrors', detail: `${money(addOn('hanging', 'additional-item'))} each extra item`, price: `from ${money(basePrice('hanging'))}`, time: time('hanging'), parts: 'mount' },
  { id: 'furniture-assembly', category: 'home', name: 'Furniture assembly', detail: 'Priced by size', price: `${money(furniture.min)} to ${money(furniture.max)}`, time: time('furniture-assembly'), parts: 'furniture' },
  { id: 'odd-jobs', category: 'home', name: 'Odd jobs', detail: '1 hr minimum', price: `${money(basePrice('odd-jobs'))}/hr`, time: time('odd-jobs'), parts: 'odd' },
  { id: 'brake-pads-1-axle', category: 'auto', name: 'Brake pads', detail: 'Per axle', price: money(basePrice('brake-pads-1-axle')), time: time('brake-pads-1-axle'), parts: 'brakes' },
  { id: 'pads-rotors-1-axle', category: 'auto', name: 'Pads + rotors', detail: 'Per axle', price: money(basePrice('pads-rotors-1-axle')), time: time('pads-rotors-1-axle'), parts: 'brakes' },
  { id: 'pads-rotors-both-axles', category: 'auto', name: 'Both axles', detail: 'Pads + rotors', price: money(basePrice('pads-rotors-both-axles')), time: time('pads-rotors-both-axles'), parts: 'brakes' },
];

export const byId = (id: string | null | undefined) => services.find((s) => s.id === id) ?? null;

export const wallTypes = [
  { value: 'drywall', label: 'Drywall' },
  { value: 'plaster', label: 'Plaster' },
  { value: 'brick', label: 'Brick or stone' },
  { value: 'fireplace', label: 'Above a fireplace' },
];

/** Furniture and odd jobs may not touch a wall at all. */
export const noWall = { value: 'none', label: 'No wall work' };

const wallLabel = (v: string) => [...wallTypes, noWall].find((w) => w.value === v)?.label ?? '';
const masonry = (a: Answers) => a['wall-type'] === 'brick' || a['wall-type'] === 'fireplace';

export const supplyOptions = {
  mount: [
    { value: 'bring', title: "I'll bring the hardware", sub: `Bracket, anchors and mounting hardware at ${markup}.` },
    { value: 'own', title: 'I already have it', sub: 'Your bracket or hardware is on hand.' },
  ],
  brakes: [
    { value: 'bring', title: "I'll bring the parts", sub: `Recommended. Matched to your VIN, billed at ${markup}.` },
    { value: 'own', title: 'I have my own parts', sub: 'Send the part number or a photo so I can check the fit.' },
  ],
  furniture: [
    { value: 'bring', title: "I'll bring the hardware", sub: `Anti-tip straps, wall anchors or anything missing from the box, at ${markup}.` },
    { value: 'own', title: "It's all in the box", sub: 'Everything the piece needs is on hand.' },
  ],
  odd: [
    { value: 'bring', title: "I'll bring the supplies", sub: `Hardware, caulk and small materials at ${markup}.` },
    { value: 'own', title: 'I already have them', sub: 'Supplies for the job are on hand.' },
  ],
};

export const tripFee = money(prices.parts.tripFee);
export const oilPrice = addOn('brake-pads-1-axle', 'oil-change');
export const hideCordsPrice = addOn('tv-mounting', 'hide-cords');
export const masonryPrice = addOn('tv-mounting', 'masonry');
export const extraItemPrice = addOn('hanging', 'additional-item');
export const tiers = service('furniture-assembly').tiers ?? [];

export interface Line {
  label: string;
  value: string;
}

/** The "Your booking" lines for the current answers. */
export function summary(id: string, a: Answers): { title: Line; lines: Line[] } | null {
  const s = byId(id);
  if (!s) return null;

  let price = s.price;
  const lines: Line[] = [{ label: 'Est. time', value: s.time }];

  if (s.parts === 'furniture') {
    const tier = tiers.find((t) => t.id === a['furniture-size']);
    if (tier) price = money(tier.price);
  }

  const supply = a['parts-supply'];
  lines.push({ label: 'Parts', value: !supply ? 'Not picked yet' : supply === 'bring' ? `I bring them (${markup})` : 'You supply' });

  if (s.id === 'hanging') {
    price = money(basePrice('hanging'));
    const extra = Math.max(0, Number(a['item-count'] || 0) - 1);
    if (extra > 0) lines.push({ label: `Extra items × ${extra}`, value: `+${money(extra * extraItemPrice)}` });
  }
  if (s.id === 'tv-mounting') {
    if (a['hide-cords'] === 'Yes') lines.push({ label: 'Hide cords', value: `+${money(hideCordsPrice)}` });
    if (masonry(a)) lines.push({ label: wallLabel(a['wall-type']), value: `+${money(masonryPrice)}` });
  }
  if (s.parts === 'brakes' && a['oil-change'] === 'Yes') {
    lines.push({ label: 'Oil change add-on', value: `+${money(oilPrice)}` });
  }

  return { title: { label: s.name, value: price }, lines };
}

/**
 * Cal.com prefill: each key must match a booking question's identifier on that
 * event type (see README). Only answers that apply to the service are sent.
 */
export function prefill(id: string, a: Answers): Record<string, string> {
  const s = byId(id);
  if (!s) return {};
  const out: Record<string, string> = {};
  const set = (k: string, v: string | undefined) => {
    if (v) out[k] = v.trim();
  };

  set('parts-supply', a['parts-supply'] === 'bring' ? `Wrench & Level brings them (${markup})` : a['parts-supply'] === 'own' ? 'Customer supplies' : '');
  if (a['parts-supply'] === 'own') set('trip-fee-ok', a['trip-fee-ok'] === 'Yes' ? 'Yes' : '');
  if (s.parts !== 'brakes') set('wall-type', wallLabel(a['wall-type']));
  if (s.id === 'tv-mounting') {
    set('tv-size', a['tv-size']);
    set('hide-cords', a['hide-cords'] === 'Yes' ? 'Yes' : 'No');
  }
  if (s.id === 'hanging') set('item-count', a['item-count']);
  if (s.parts === 'furniture') {
    const tier = tiers.find((t) => t.id === a['furniture-size']);
    set('furniture-size', tier ? `${tier.name} (${money(tier.price)})` : '');
    set('pieces', a['pieces']);
  }
  if (s.parts === 'odd') set('job-details', a['job-details']);
  if (s.parts === 'brakes') {
    set('vehicle', a['vehicle']);
    set('vin', a['vin']?.toUpperCase());
    if (a['parts-supply'] === 'own') {
      set('part-number', a['part-number'] || (a['photo-instead'] === 'Yes' ? 'Will text a photo of the box' : ''));
    }
    set('oil-change', a['oil-change'] === 'Yes' ? 'Yes' : 'No');
  }
  return out;
}

/** The line /booked shows about parts. */
export function partsNote(id: string, supply: string | null): string {
  const s = byId(id);
  if (!s) return '';
  if (supply === 'own') return "Have your parts out and ready. I'll text the day before to double check.";
  if (s.parts === 'brakes') return "I'll pick up your parts using your VIN before the job.";
  if (s.parts === 'mount') return "I'll bring the bracket and hardware.";
  if (s.parts === 'furniture') return "I'll bring any hardware the piece needs.";
  if (s.parts === 'odd') return "I'll bring the supplies for the job.";
  return '';
}
