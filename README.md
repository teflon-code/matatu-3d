# Matatu Run 3D — Nairobi

A small browser-based 3D matatu-driving game prototype. It builds named Nairobi road geometry from OpenStreetMap data and can show official Google Maps hybrid/satellite imagery in the map panel.

## Run locally

```bash
npm install
cp .env.example .env
# Optional: add your Google Maps JavaScript API key to .env
npm run dev
```

Open the local URL printed by Vite. The 3D game and OSM road network work without a Google key; the map panel displays Google imagery only when a valid key is configured.

## Google Maps imagery

Create a Google Maps Platform project, enable the Maps JavaScript API, configure billing and an appropriate website/referrer restriction, then set:

```env
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

Do not commit `.env` or publish the API key. Google imagery is embedded through the official Maps JavaScript API; this project does not download, scrape, or use Google tiles as textures. The Google map is a separate reference panel. Review Google Maps Platform terms, attribution, and usage requirements before deployment.

## Real roads and map data

The game requests named road geometry for central Nairobi from the OpenStreetMap Overpass API at runtime and draws it in the 3D scene. The map area is configured in `src/main.js` (`BBOX` and `CENTER`). OSM data is © OpenStreetMap contributors and available under the Open Database License (ODbL); retain the on-screen attribution. Overpass is a shared public service, so for a deployed game use a suitable hosted OSM extract or provider and cache requests responsibly.

Roads and names are real mapped data; traffic, pedestrians, fares, and driving are game simulations—not live traffic or transit information. The buildings and vehicle models are procedural prototypes, not photorealistic assets.

## Controls

- **W / S** — accelerate / brake and reverse
- **A / D** — steer
- **E** — board or drop a passenger near a mapped landmark
- **C** — cycle chase, cab, overhead, and cinematic cameras
- **H** — horn notification

## Build

```bash
npm run build
npm run preview
```
