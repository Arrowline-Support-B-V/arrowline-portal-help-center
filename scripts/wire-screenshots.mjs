import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const locales = ['', 'nl', 'ro', 'pl', 'es', 'fr', 'pt', 'de'];

const map = {
  'start/sign-in': ['signin'],
  'start/password-reset': ['reset', 'reset-code'],
  'start/dashboard': ['parcel-dashboard', 'pallet-dashboard', 'ftl-dashboard'],
  'start/choose-your-workflow': ['header'],
  'start/account': ['account'],
  'portal/searching': ['shipments', 'pallet-shipments', 'ftl-shipments'],
  'portal/shipment-details': ['pallet-detail', 'pallet-package'],
  'portal/statuses': ['pallet-package'],
  'portal/filters-and-exports': ['shipments'],
  'parcels/shipments': ['shipments'],
  'parcels/shipment-detail': ['shipments'],
  'parcels/tracking': ['shipments'],
  'parcels/returns': ['returns', 'returns-detail', 'returns-package'],
  'parcels/performance': ['parcel-report'],
  'parcels/statuses': ['parcel-dashboard'],
  'parcels/delivery-exceptions': ['shipments-exceptions'],
  'parcels/claims': ['claims', 'claims-add', 'claims-result'],
  'parcels/tickets': ['tickets', 'tickets-add', 'ticket-thread'],
  'pallets/public-tracking': ['track', 'track-detail'],
  'pallets/incoming-orders': ['incoming-orders'],
  'pallets/shipments': ['pallet-shipments'],
  'pallets/shipment-detail': ['pallet-detail'],
  'pallets/package-detail': ['pallet-package'],
  'pallets/statuses': ['pallet-package'],
  'pallets/proof-of-delivery': ['pallet-package'],
  'pallets/claims': ['claims', 'claims-add', 'claims-result'],
  'pallets/tickets': ['tickets', 'tickets-add', 'ticket-thread'],
  'truckloads/shipments': ['ftl-shipments'],
  'truckloads/shipment-detail': ['ftl-detail'],
  'truckloads/statuses': ['ftl-dashboard'],
  'truckloads/performance': ['ftl-report'],
  'support/create-ticket': ['tickets-add'],
  'support/track-ticket': ['ticket-thread'],
  'support/cannot-sign-in': ['signin-error'],
  'support/shipment-not-found': ['not-found'],
  'support/status-not-updated': ['pallet-package'],
  'support/portal-errors': ['portal-errors'],
};

const alts = {
  signin: 'Arrowline Portal sign-in page with dummy data',
  'signin-error': 'Sign-in page showing an incorrect email or password message',
  reset: 'Password reset request page',
  'reset-code': 'Password reset code and new password steps',
  track: 'Public pallet tracking search',
  'track-detail': 'Public pallet tracking detail for a dummy order',
  header: 'Signed-in module header with Parcel, Pallets and Truckload',
  'parcel-dashboard': 'Parcel dashboard with dummy shipment totals',
  shipments: 'Parcel shipment list with dummy Demo Logistics rows',
  'shipments-exceptions': 'Parcel shipment list filtered to exceptions',
  claims: 'Parcel claims list with dummy claims',
  'claims-add': 'Create parcel claim form',
  'claims-result': 'Dummy claim result page',
  tickets: 'Parcel ticket list with dummy tickets',
  'tickets-add': 'Create ticket form',
  'ticket-thread': 'Support ticket conversation without customer names or logos',
  returns: 'Parcel returns list with dummy returns',
  'returns-detail': 'Return detail with dummy return RT-10011',
  'returns-package': 'Return package detail with dummy destination data',
  'parcel-report': 'Parcel performance report with dummy totals',
  'pallet-dashboard': 'Pallet dashboard with dummy order totals',
  'pallet-shipments': 'Pallet shipment list with dummy orders',
  'incoming-orders': 'Incoming orders and Ready To Ship workbench',
  'pallet-detail': 'Pallet shipment detail for a dummy order',
  'pallet-package': 'Pallet details',
  'ftl-dashboard': 'Truckloads dashboard with Planned, In Transit and Arrived',
  'ftl-shipments': 'Truckloads shipment list with dummy transports',
  'ftl-detail': 'Truckloads transport detail with dummy stops',
  'ftl-report': 'Truckloads performance report with dummy totals',
  account: 'Account page for Demo Logistics BV',
  'not-found': 'Shipment not-found search result',
  'portal-errors': 'Portal error page without customer data',
};

const captions = {
  signin: 'Sign-in page. The example uses demo.user@example.com.',
  'signin-error': 'Failed sign-in. The email is dummy data.',
  reset: 'Password reset request.',
  'reset-code': 'Reset code and new password steps. No real code is shown.',
  track: 'Public pallet tracking search.',
  'track-detail': 'Public tracking detail for dummy order AL-100245.',
  header: 'Module header after sign-in: Parcel, Pallets and Truckload.',
  'parcel-dashboard': 'Parcel dashboard for Demo Logistics BV.',
  shipments: 'Parcel shipment list. All rows use dummy data.',
  'shipments-exceptions': 'Shipment list filtered to exceptions.',
  claims: 'Parcel claims list with dummy claim numbers.',
  'claims-add': 'Create-claim form. No real invoice is attached.',
  'claims-result': 'Claim result for dummy claim CL-2041.',
  tickets: 'Parcel ticket list with dummy tickets.',
  'tickets-add': 'Create-ticket form for dummy order AL-100245.',
  'ticket-thread': 'Ticket conversation without customer names or logos.',
  returns: 'Parcel returns list with dummy return numbers.',
  'returns-detail': 'Return detail for dummy return RT-10011.',
  'returns-package': 'Return package detail for dummy parcel 0001234567890123.',
  'parcel-report': 'Parcel performance report for a dummy period.',
  'pallet-dashboard': 'Pallet dashboard for Demo Logistics BV.',
  'pallet-shipments': 'Pallet shipment list with dummy orders.',
  'incoming-orders': 'Incoming orders and Ready To Ship.',
  'pallet-detail': 'Pallet order AL-100245 with dummy destination data.',
  'pallet-package': 'Pallet details with dummy values.',
  'ftl-dashboard': 'Truckloads dashboard with Planned, In Transit and Arrived.',
  'ftl-shipments': 'Truckloads list. Origin, destination and plate are dummy.',
  'ftl-detail': 'Truckload AL-100245 with dummy stops.',
  'ftl-report': 'Truckloads performance report with dummy totals.',
  account: 'Account page for Demo Logistics BV.',
  'not-found': 'No shipment found for a dummy identifier.',
  'portal-errors': 'Example portal error without customer data.',
};

function replaceNth(text, find, replacements) {
  let i = 0;
  return text.replaceAll(find, () => replacements[Math.min(i++, replacements.length - 1)]);
}

async function walk(dir, acc = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git', 'images'].includes(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path, acc);
    else if (entry.name.endsWith('.mdx')) acc.push(path);
  }
  return acc;
}

const files = await walk(root);
let updated = 0;
for (const file of files) {
  const rel = file.slice(root.length).replaceAll('\\', '/').replace(/^\//, '').replace(/\.mdx$/, '');
  const key = rel.replace(/^(nl|ro|pl|es|fr|pt|de)\//, '');
  const names = map[key];
  if (!names) continue;
  let text = await readFile(file, 'utf8');
  const english = !/^(nl|ro|pl|es|fr|pt|de)\//.test(rel);
  const srcs = names.map(name => `/images/screenshots/${name}.png`);
  const nextAlts = names.map(name => alts[name]);
  let i = 0;
  text = text.replace(/<img src="\/images\/screenshot-placeholder\.svg" alt="[^"]*" \/>/g, () => {
    const name = names[Math.min(i, names.length - 1)];
    const src = srcs[Math.min(i, srcs.length - 1)];
    const alt = nextAlts[Math.min(i, nextAlts.length - 1)];
    i += 1;
    return `<img src="${src}" alt="${alt}" />`;
  });
  if (english) {
    let c = 0;
    text = text.replace(/<Frame caption="Screenshot required — [^"]*">/g, () => {
      const name = names[Math.min(c, names.length - 1)];
      c += 1;
      return `<Frame caption="${captions[name]}">`;
    });
  }
  await writeFile(file, text);
  updated += 1;
}
console.log(`Updated ${updated} articles`);
