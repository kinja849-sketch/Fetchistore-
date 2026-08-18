# Implementation Prompt: Real Google Maps, Device Geolocation, Places Search & Directions Routing

## 1. Goal
Refactor and upgrade Fetchistore's map and discovery engine to use real device geolocation, Google Maps JavaScript API, Google Places Autocomplete, and Google Directions routing API for true proximity discovery and seller-to-door delivery tracking:
1. **Real position first**: Obtain user location via `navigator.geolocation`. On load, request coordinates; store `{ lat, lng }` in client state and profile. On deny/error, present a clear "Enable location" / "Location unavailable" UI state instead of hardcoded New York default coordinates.
2. **Real Google Map**: Replace dark fallback panel with Maps JavaScript API instance (`google.maps.Map`). Display live map center, user marker, listing markers, and usable zoom controls.
3. **API Key & Config Error**: Read `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` from env (`.env.local` & `.env.example`). If missing, show a clear config error message instead of initializing a broken map.
4. **Coordinate Chip**: Display live `lat.toFixed(4)°, lng.toFixed(4)°` chip matching map center / user marker position, updating when geolocation succeeds or a place is picked.
5. **Places Search**: Integrate Places Autocomplete / search box on Near You map and location selection flows so users can search and pick addresses, recentering the map and updating coordinates.
6. **Directions API for Distance & ETA**: Call Google Maps Directions API / `google.maps.DirectionsService` between user/buyer point and listing/seller point to obtain real route distance and travel duration (e.g. "1.2 km · ~8 min") for Near You listing cards and order delivery tracking.
7. **Data Wiring**: Pass active `{ lat, lng }` and proximity radius into listing queries (`getNearbyListingsAction` / PostGIS RPC). Update the "N items within radius" label based on actual query result count. Store seller's exact `POINT(lng lat)` when publishing listings.
8. **Clerk Unchanged**: Keep Clerk for authentication; Google Cloud APIs strictly for maps, places, and routes.
9. **Mobile-Safe & Security**: Graceful handling of browser permission prompts and missing keys; document Google Cloud API key HTTP referrer restrictions.

## 2. Skills Read & Code Inspected
- **Skills**: Section 10 (`Geolocation & delivery tracking`) and Section 7 (`UI Design`) of `AGENTS.md`, `ui-design` skill.
- **Code Inspected**:
  - `components/maps/google-map.tsx` (Current map component)
  - `components/maps/map-pin-picker.tsx` (Current pin picker)
  - `components/home/authenticated-feed.tsx` (Home / Near You map feed view)
  - `app/shop/page.tsx` (Shop discovery & radius filter)
  - `app/actions/geo.ts` (Geospatial server actions & RPC wrappers)
  - `app/actions/listings.ts` (Listing CRUD & PostGIS location insertion)
  - `lib/geo.ts` (Geospatial utilities & coordinate helpers)
  - `app/orders/[id]/page.tsx` (Order delivery tracking page)

## 3. Key Architectural & Implementation Decisions
1. **Geolocation Hook (`lib/hooks/use-user-location.ts`)**:
   - Manages status (`'loading' | 'ready' | 'denied' | 'error'`), `location: { lat, lng } | null`, error message, and a `refreshLocation()` function.
   - Invokes `navigator.geolocation.getCurrentPosition` with `enableHighAccuracy: true`, `timeout: 10000`, `maximumAge: 30000`.
   - Never falls back silently to NYC coordinates; explicitly indicates `'denied'` or `'error'` so the UI can request permission or offer Places Search.
2. **Google Maps JS API Engine (`components/maps/google-map.tsx`)**:
   - Injects Google Maps JS API script with `libraries=places`.
   - Renders a real `google.maps.Map` instance with custom marker icons for user location, listings, and seller delivery vehicles.
   - If `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is missing or invalid, displays a clean configuration warning box.
   - Binds zoom controls and marker click listeners directly to the Google Maps instance.
3. **Places Autocomplete (`components/maps/places-autocomplete.tsx`)**:
   - Integrates Google Maps Places Autocomplete input field.
   - On place selection (`place_changed`), extracts `geometry.location.lat()` and `lng()`, recenters the map, updates the coordinate chip, and triggers query refetching.
4. **Directions Service Helper (`lib/directions.ts`)**:
   - Requests real driving/biking routes via `google.maps.DirectionsService` or Directions API endpoint.
   - Returns exact distance text (e.g., `"1.2 km"`) and travel duration (e.g., `"8 mins"`).
   - Includes client-side caching / debouncing to minimize API quota usage.
5. **Listing Geo Wiring (`app/actions/listings.ts` & `app/actions/geo.ts`)**:
   - Pass user's real `{ lat, lng }` and `radiusKm` into `getNearbyListingsAction`.
   - On seller listing creation (`app/seller/listings/create/page.tsx`), store real `lat`/`lng` in `location` column as `POINT(lng lat)`.

## 4. Files to Change / Create
- `[NEW]` `lib/hooks/use-user-location.ts` (Browser geolocation custom hook with status state)
- `[NEW]` `lib/directions.ts` (Google Maps Directions routing helper with caching)
- `[NEW]` `components/maps/places-autocomplete.tsx` (Google Places search input component)
- `[MODIFY]` `components/maps/google-map.tsx` (Real Google Maps JS SDK rendering, key validation, directions layer, user & listing markers)
- `[MODIFY]` `components/maps/map-pin-picker.tsx` (Integrate `useUserLocation` and `PlacesAutocomplete`)
- `[MODIFY]` `components/home/authenticated-feed.tsx` (Integrate real `useUserLocation`, Places search, real coordinate chip, and real nearby count)
- `[MODIFY]` `app/shop/page.tsx` (Wire live location and radius query into shop discovery grid)
- `[MODIFY]` `app/actions/geo.ts` (Ensure nearby listings query filters by real user coordinates and radius)
- `[MODIFY]` `app/actions/listings.ts` (Ensure seller location is accurately stored as WKT POINT)
- `[MODIFY]` `app/orders/[id]/page.tsx` (Directions route rendering on live delivery tracking map)
- `[MODIFY]` `.env.local` & `.env.example` (Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` with documentation on HTTP referrer restrictions)

## 5. Security & Mobile Compliance
- API Key exposure restricted via Google Cloud HTTP referrers (`localhost:3000` + production domain).
- Mobile browser permissions handled gracefully with explicit user-facing retry CTAs when denied.
- Zero reliance on fake NYC fallback coordinates when device location is unavailable.

## 6. Verification Plan
- Run `npm run typecheck` to confirm clean TypeScript compilation with zero errors.
- Test geolocation prompt on Near You section.
- Test place search with Places Autocomplete to update map center and coordinate chip.
- Test nearby listing count updates reflecting actual Supabase query results.
- Test Directions route display for listing distance and delivery tracking ETA.
