# Arrowline Portal Help Center

Mintlify help center for the Arrowline Customer Portal, focused on operational usage of Parcels, Pallets and Truckloads.

## Local preview

```bash
npm install -g mint
mint dev
```

Open the local preview shown by the CLI. The documentation is written in MDX and is intended to be connected to a Git repository in Mintlify.

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
