# Current Feature

## Status

Not Started

## Goals

<!-- Goals go here -->

## Notes

<!-- Notes go here -->

## History

- **2026-04-29** — Collections Pages & Navigation: Made CollectionCard a clickable Link to /collections/[id]. Enhanced /collections/[id] with back link, collection name/description header, item count badge, and passed collections for ItemDrawer. Added userId filtering to getAllCollections, getRecentCollections, getFavoriteCollections, and getCollectionById. Updated all 5 call sites (dashboard, collections, collection detail, items by type, profile). Removed overlay Link hack from /collections/page.tsx. Build and lint pass clean.