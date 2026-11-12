# Matatu Run 3D — Nairobi

An original browser-based Nairobi matatu driving game prototype. It uses familiar genre conventions (city routes, bus stops, traffic, and driving controls) without copying Bus Simulator EVO code, assets, maps, or branding.

## Garage and play

The game opens with a full-screen garage and a live, animated 3D matatu preview. Choose a route badge (**14**, **46**, or **101**) and one of nine original procedural paint jobs, then press **START SHIFT**. The chosen badge is saved locally in the browser. The available game route loop is still the current Kencom/CBD/Westlands/Yaya route; route badge selection currently changes its garage signage/theme, not the underlying real-world transit route.

- **W / S** or arrow keys: accelerate / brake / reverse
- **A / D** or arrow keys: steer
- **F**: door interlock / serve stage (only when stopped)
- **Q / E**: left / right indicators
- **C**: chase, cab, overhead, cinematic camera
- **H**: horn; **L** headlights; **K** wipers; **M** radio; **P** pause; **R** return to Kencom
- **Space**: handbrake
- Touch controls are available on smaller screens.

## Original liveries

CBD Chrome, Sheng Star, Savannah Pulse, Night Runner, Green Machine, Glow District, After Hours, Kibera Lights, and Nairobi Neon. They use generated color palettes and abstract geometric motifs inspired by broad matatu livery traditions and the visual energy showcased by [Nganya Kenya](https://www.instagram.com/nganya_kenya/). They do not use Instagram photos, identifiable vehicle wraps, artist tags, portraits, logos, or slogans. Share an authorized reference and credit information if you want a specific design recreated with permission.

## Run locally

```sh
npm install
npm run dev
```

Optional Google Maps imagery: create a local `.env` (do not commit it) with `VITE_GOOGLE_MAPS_API_KEY=...`; optionally set `VITE_GOOGLE_MAP_ID=...`. Restrict the key by API and web referrers. Google Maps is an optional inset using the official Maps JavaScript API; imagery is not scraped or used as Three.js assets.

## Nairobi data

Named roads and mapped building footprints load from OpenStreetMap Overpass at runtime; if the service is unreachable, an offline practice grid keeps the game playable. Route stops include Kencom, Railways, KICC/City Hall Way, Westlands, and Yaya Centre. OSM attribution is included under the Open Database License (ODbL).

Vehicles, pedestrians, radio tones, fares, traffic behavior, and physics are procedural simulations—not live transit or traffic data.
