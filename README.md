# Matatu Run 3D — Nairobi

Browser-based matatu driving prototype with a bright green, detailed procedural matatu, custom right-hand-drive cab dashboard and steering wheel, and chase/cab/overhead/cinematic cameras. Named Nairobi road and mapped building geometry comes from OpenStreetMap. An optional Google Maps panel shows official hybrid imagery and follows the player.

## Run locally

```sh
npm install
cp .env.example .env
# Add your key to .env; never commit it.
npm run dev
```

Set `VITE_GOOGLE_MAPS_API_KEY` in `.env`. To request a Google vector map configuration with 3D building visualization where available, you can also set `VITE_GOOGLE_MAP_ID` to a Map ID created in Google Cloud. Enable Maps JavaScript API, configure billing, and restrict the key to your local/deployed website referrers. Restart Vite after editing `.env`. Build with `npm run build`.

The official Google map is a separate inset, centered on the bus as it moves. Its HYBRID/ROAD button changes map mode. Google imagery/buildings are displayed only inside the official Google Maps API; the game does not scrape, download, or convert Google map content into Three.js assets. Google map features such as tilt/3D buildings depend on supported map type, Map ID, zoom, region, browser, and current Google Maps Platform behavior.

## Roads, buildings, and attribution

The 3D world requests named roads and building footprints for central Nairobi from OpenStreetMap Overpass at runtime. Roads use mapped centerlines; building masses follow mapped footprints, with approximate procedural height/material details where OSM tags are incomplete. This is not a photorealistic scan. The road query area is `BBOX` in `src/main.js`. Keep OSM attribution visible; data © OpenStreetMap contributors under the Open Database License (ODbL). Public Overpass endpoints have availability/rate limits; for production, use a hosted extract/provider and cache responsibly.

Traffic, pedestrians, fares, and driving are simulations, not live traffic data. Controls: W/S drive/brake, A/D steer, E stop/board/drop off, C change camera, H horn.
