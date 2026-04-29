# Current Feature

## Status

Not Started

## Goals

<!-- Goals go here -->

## Notes

<!-- Notes go here -->

## History

- **2026-04-29** — Collections Pages & Navigation: Made CollectionCard a clickable Link to /collections/[id]. Enhanced /collections/[id] with back link, collection name/description header, item count badge, and passed collections for ItemDrawer. Added userId filtering to getAllCollections, getRecentCollections, getFavoriteCollections, and getCollectionById. Updated all 5 call sites. Removed overlay Link hack from /collections/page.tsx. Build and lint pass clean.
- **2026-04-29** — Collection Actions (Edit, Delete, Favorite): Added dropdown menu on collection cards with edit, favorite, delete. Added favorite/edit/delete buttons on /collections/[id] header. Edit opens modal for metadata. Delete confirms that items are not deleted, only removed from collection. Favorite toggles isFavorite. Created DropdownMenu UI component, EditCollectionDialog, DeleteCollectionDialog, CollectionDetailActions. Added updateCollection, deleteCollection, toggleFavoriteCollection DB functions and server actions.