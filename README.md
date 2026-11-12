# Matatu Run 3D — Nairobi

An original browser-based Nairobi matatu driving game prototype. It uses familiar genre conventions (city routes, bus stops, traffic, driving controls) but does not copy Bus Simulator EVO code, assets, maps, or branding.

## Play and controls

The game starts on a Nairobi CBD loop route. Drive to each glowing stage, brake to a stop, press **F** to open doors, and hold position while the conductor boards/alights passengers. Doors auto-close after the service animation. Earn fares for passenger drop-offs and avoid speeding and traffic bumps.

- **W / S** or arrow keys: accelerate / brake / reverse
- **A / D** or arrow keys: steer
- **F**: door interlock / serve stage (only when stopped)
- **Q / E**: left / right indicators
- **C**: chase, cab, overhead, cinematic camera
- **H**: horn; **L** headlights; **K** wipers; **M** radio; **P** pause; **R** return to Kencom
- **Space**: handbrake
- Touch controls are available on smaller screens.

## Run locally

```sh
npm install
npm run dev
```

Optional Google Maps imagery: create a local `.env` (do not commit it) with `VITE_GOOGLE_MAPS_API_KEY=...`; optionally set `VITE_GOOGLE_MAP_ID=...`. Restrict the key by API and web referrers. Google Maps is an optional inset using the official Maps JavaScript API. Google imagery is not scraped, copied, or rendered as Three.js assets.

## Nairobi data

Named roads and mapped building footprints load from OpenStreetMap Overpass at runtime; if the service is unreachable, an offline practice grid keeps the game playable. The route has named Nairobi stages (Kencom, Railways, KICC/City Hall Way, Westlands, Yaya Centre). On-screen map data attribution is included. OSM data © OpenStreetMap contributors, under the Open Database License (ODbL). Public Overpass servers can rate-limit requests; use a hosted OSM extract/provider for production.

Vehicles, pedestrians, radio tones, fares, traffic behavior, and physics are procedural game simulations—not live transit or traffic data. No assets or proprietary implementation from Bus Simulator EVO are used.
