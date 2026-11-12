# Matatu Run 3D — Nairobi

Browser-based matatu driving prototype with a procedural green matatu, custom cab interior, chase/cab/overhead/cinematic cameras, and real Nairobi road and building geometry from OpenStreetMap.

## Run locally

```sh
npm install
cp .env.example .env
# Optional, for the Google Maps reference panel: set VITE_GOOGLE_MAPS_API_KEY in .env
npm run dev
```

Build with `npm run build`. Controls: W/S drive and brake, A/D steer, E stop/board/drop off, C cycle camera views, H horn.

## Map data and imagery

The game requests named road geometry and building footprints for central Nairobi from OpenStreetMap's Overpass API at runtime. Roads and mapped buildings are rendered in the 3D scene; the procedural colors/facade details are visual approximations, not photorealistic scans. The query bbox is in `src/main.js` (`BBOX`). Retain OSM attribution; data is © OpenStreetMap contributors and subject to the ODbL. Public Overpass endpoints have availability/rate limits; production deployments should use a suitable hosted extract/provider and cache responsibly.

Optional Google Maps imagery appears in the separate inset through the official Maps JavaScript API, and requires a Google Maps Platform key with Maps JavaScript API enabled, billing configured, and website/referrer restrictions. Do not commit the key. Imagery is not copied into Three.js or used as a game texture. Review Google's terms and attribution requirements before deployment.

Traffic and pedestrians are game simulations, not live traffic data. The vehicle/dashboard are original procedural meshes inspired by the supplied visual reference, not downloaded 3D assets.
