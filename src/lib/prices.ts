import prices from '../data/prices.json';

export type Service = (typeof prices.services)[number];

export const markup = `cost + ${prices.parts.markupPercent}%`;
export const tripFee = money(prices.parts.tripFee);

export function money(n: number): string {
  return `$${n}`;
}

export function service(id: string): Service {
  const s = prices.services.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown service "${id}" in prices.json`);
  return s;
}

export function addOn(serviceId: string, addOnId: string): number {
  const a = service(serviceId).addOns.find((x) => x.id === addOnId);
  if (!a) throw new Error(`Unknown add-on "${addOnId}" on "${serviceId}"`);
  return a.price;
}

export function basePrice(id: string): number {
  const s = service(id);
  if ('price' in s && typeof s.price === 'number') return s.price;
  throw new Error(`Service "${id}" has tiers, not a single price`);
}

export function tierRange(id: string): { min: number; max: number } {
  const tiers = service(id).tiers ?? [];
  const ps = tiers.map((t) => t.price);
  return { min: Math.min(...ps), max: Math.max(...ps) };
}

/** "about 1.5 hr" from the service's booking length. */
export function duration(id: string): string {
  const hr = service(id).durationMin / 60;
  return `about ${Number.isInteger(hr) ? hr : hr.toFixed(1)} hr`;
}
