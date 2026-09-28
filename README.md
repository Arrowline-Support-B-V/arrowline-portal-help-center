# Arrowline Portal Help Center

Self-hosted help center for the Arrowline Customer Portal. It uses a Mintlify-inspired documentation layout and deploys to Vercel without a Mintlify runtime or subscription. The original MDX articles and `docs.json` navigation remain the content source.

## Deploy to Vercel

1. Import this repository into Vercel, or point the existing Vercel project at this repository and branch.
2. Select **Other** as the framework preset. The checked-in `vercel.json` sets the build command to `npm run build` and output directory to `dist`.
3. Deploy. All 344 articles across eight languages are generated as static HTML, including searchable article metadata.
4. Test the production domain and one article in each language. The URL shared for this project is a protected preview and currently asks visitors to sign in to Vercel; use the project's production domain for public access, or review Deployment Protection settings intentionally.
5. If moving a custom help domain from Mintlify, add it to the Vercel project, follow the DNS verification values shown by Vercel, then remove the domain from Mintlify after the Vercel site is working. Avoid connecting the same host to both providers at once.

The current GitHub repository already contains all content. Pushing the static frontend and its lockfile is sufficient for future Vercel builds. Editing MDX or `docs.json` and redeploying updates the help center; the Mintlify dashboard is no longer part of the publishing workflow.

## Local build

```bash
npm ci
npm run build
npx serve dist
```

Open the local address printed by `serve`. Production output lives in `dist/` and does not need a Node server.

Use `CONTENT-COVERAGE.md` to see which portal routes are documented. Screenshot placeholders name the portal route that still needs a real, masked screen.

## Branding

Visual identity follows the [Arrowline Brand Guide](https://arrowlinebrandguide.framer.website/):

- Arrow Red `#F23F3F`, Line Red `#BF2E3F`, Paracetamol White `#FFF4ED`, Coffee Black `#28302D`, Container Grey `#C2BFB8`
- Full logo (Wing + wordmark) and Wing favicon
- Volksans Normal for body text and Volksans Semibold for headings

Help Center copy stays operational: clear and warm, not witty.

## Locales

The language switcher includes:

- English (`en`, default)
- Dutch (`nl`)
- Romanian (`ro`)
- Polish (`pl`)
- Spanish (`es`)
- French (`fr`)
- Portuguese (`pt`)
- German (`de`)

English is the default language and lives at the repository root. The other locales use the same folder structure in `nl/`, `ro/`, `pl/`, `es/`, `fr/`, `pt/` and `de/`. In translated pages, product names follow the tab labels (`Pakketten`, `Paquetes`, `Colis`, and so on). Portal UI labels such as **Sign in**, **Ready To Ship**, **Planned**, **In Transit** and **Arrived** stay in English.

## Content principles

- Task-first navigation instead of technical documentation first.
- Parcels, Pallets and Truckloads have separate workflows.
- No duplicate tickets or duplicate claims.
- Shipment-specific facts must come from the portal or connected operational systems.
- Screenshots should be added to the relevant pages during the visual documentation pass.
