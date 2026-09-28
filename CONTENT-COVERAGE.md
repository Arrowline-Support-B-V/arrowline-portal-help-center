# Content coverage checklist

Internal authoring checklist. This file is not part of the customer navigation.

Source: Arrowline Customer Portal Functional Specification v1.3 route catalogue.
Help Center scope: customer usage of **Parcels**, **Pallets** and **Truckloads**. Administrator-only, incomplete prototype and feature-flagged analytics routes stay out of scope.

Status key:

- `documented` — a customer page exists and covers the route
- `partial` — a related page exists, but the route-specific steps or fields are incomplete
- `missing` — no customer page yet
- `out of scope` — not planned for this Help Center

## Authentication and landing

| Portal route | Screen | Status | Help Center page |
| --- | --- | --- | --- |
| `/auth/signin` | Sign in | documented | `start/sign-in`, `support/cannot-sign-in` |
| `/auth/reset` | Password reset | documented | `start/password-reset` |
| `/` | Module landing and navigation | documented | `start/choose-your-workflow`, `start/dashboard` |

## Parcel operations

| Portal route | Screen | Status | Help Center page |
| --- | --- | --- | --- |
| `/parcel` | Parcel dashboard | documented | `start/dashboard`, `parcels/overview` |
| `/shipments` | Parcel shipment list | documented | `parcels/shipments` |
| `/claims` | Parcel claims overview | documented | `parcels/claims` |
| `/claims/add` | Create parcel claim | documented | `parcels/claims` |
| `/claims/result/[id]` | Parcel claim result | documented | `parcels/claims` |
| `/tickets` | Parcel ticket overview | documented | `parcels/tickets` |
| `/tickets/add` | Create parcel ticket | documented | `parcels/tickets`, `support/create-ticket` |
| `/returns` | Returns overview | documented | `parcels/returns` |
| `/returns/detail/[id]` | Return detail | documented | `parcels/returns` |
| `/returns/package-detail/[id]` | Return package detail | documented | `parcels/returns` |
| `/returns/ticket/[...slug]` | Parcel ticket conversation | documented | `parcels/tickets`, `support/track-ticket` |
| `/report/detail` | Parcel performance report | documented | `parcels/performance` |
| `/analytics/parcel` | Parcel analytics | out of scope | Feature-flagged reporting, not day-to-day portal usage |

## Public pallet tracking

| Portal route | Screen | Status | Help Center page |
| --- | --- | --- | --- |
| `/track` | Public pallet tracking search | documented | `pallets/public-tracking` |
| `/track/[orderNumber]/[barcode]` | Public pallet tracking detail | documented | `pallets/public-tracking` |
| `/track/[orderNumber]` | Public pallet tracking resolver | documented | `pallets/public-tracking` |

## Pallet operations

| Portal route | Screen | Status | Help Center page |
| --- | --- | --- | --- |
| `/pallet` | Pallet dashboard | documented | `start/dashboard`, `pallets/overview` |
| `/pallet-shipments` | Pallet shipment list | documented | `pallets/shipments` |
| `/pallet/incoming-orders` | Incoming orders and ready-to-ship workbench | documented | `pallets/incoming-orders` |
| `/pallet/detail/[orderNumber]` | Pallet shipment detail | documented | `pallets/shipment-detail` |
| `/pallet/package-detail/[barcode]` | Pallet package detail | documented | `pallets/package-detail` |
| `/pallet/claims` | Pallet claims overview | documented | `pallets/claims` |
| `/pallet/claims/add` | Create pallet claim | documented | `pallets/claims` |
| `/pallet/claims/result/[id]` | Pallet claim result | documented | `pallets/claims` |
| `/pallet/tickets` | Pallet ticket overview | documented | `pallets/tickets` |
| `/pallet/tickets/add` | Create pallet ticket | documented | `pallets/tickets`, `support/create-ticket` |
| `/pallet/ticket/[...slug]` | Pallet ticket conversation | documented | `pallets/tickets`, `support/track-ticket` |
| `/pallet-sla` | Pallet SLA dashboard | out of scope | Global administrator only |
| `/analytics/pallet` | Pallet analytics | out of scope | Feature-flagged reporting |

## Truckload / FTL

| Portal route | Screen | Status | Help Center page |
| --- | --- | --- | --- |
| `/ftl` | Truckload dashboard | documented | `start/dashboard`, `truckloads/overview` |
| `/ftl-shipments` | FTL shipment list | documented | `truckloads/shipments` |
| `/ftl-shipments/detail/[id]` | FTL shipment detail | documented | `truckloads/shipment-detail` |
| `/ftl-performance-report` | FTL performance report | documented | `truckloads/performance` |
| `/ftl-performance-report/detail/[id]` | FTL performance detail | out of scope | Incomplete prototype in the spec snapshot |
| `/analytics/truckload` | FTL analytics | out of scope | Feature-flagged reporting |

## Account and fallback

| Portal route | Screen | Status | Help Center page |
| --- | --- | --- | --- |
| `/account` | Account | documented | `start/account` |
| `/system-health` | System health | out of scope | Administrator / operations |
| `/maintenance` | Maintenance | out of scope | Public presentation route |
| `/404` | Not found | out of scope | Portal fallback, not Help Center content |

## Cross-cutting Help Center topics

These are not single portal routes, but they are required customer tasks.

| Topic | Status | Help Center page |
| --- | --- | --- |
| Login | documented | `start/sign-in` |
| Password reset | documented | `start/password-reset` |
| Dashboard KPIs and widgets | documented | `start/dashboard` |
| Navigation and module entitlements | documented | `start/choose-your-workflow` |
| Searching | documented | `portal/searching`, `pallets/public-tracking`, `truckloads/shipments` |
| Shipment details | documented | `portal/shipment-details` |
| Statuses | documented | Parcel grouped statuses, pallet mapped/planning statuses, Truckloads Planned / In Transit / Arrived |
| Filters and exports | documented | `portal/filters-and-exports` |
| Claims | documented | `parcels/claims`, `pallets/claims` |
| Tickets | documented | `parcels/tickets`, `pallets/tickets`, `support/*` |
| Troubleshooting | documented | `support/cannot-sign-in`, `support/shipment-not-found`, `support/status-not-updated`, `support/portal-errors` |
| Screenshot placeholders | documented | Marked on customer pages that require a portal screen |
| Locales | documented | English default plus Dutch, Romanian, Polish, Spanish, French, Portuguese and German |
