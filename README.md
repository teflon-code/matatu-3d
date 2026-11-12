# Matatu Run 3D — Nairobi

An original browser-based Nairobi matatu driving game prototype. It uses familiar genre conventions (city routes, bus stops, traffic, driving controls) but does not copy Bus Simulator EVO code, assets, maps, or branding.

## Play and controls

Drive the Nairobi CBD loop route. Reach each glowing stage, brake to a stop, and press **F** to serve passengers. Earn fares, avoid speeding, and watch traffic.

- **W / S** or arrow keys: accelerate / brake / reverse
- **A / D** or arrow keys: steer
- **F**: door interlock / serve stage (only when stopped)
- **Q / E**: left / right indicators
- **C**: chase, cab, overhead, cinematic camera
- **H**: horn; **L** headlights; **K** wipers; **M** radio; **P** pause; **R** return to Kencom
- **Space**: handbrake
- Touch controls are available on smaller screens.
- Pick an original matatu paint design in the **Matatu Garage** panel.

## Matatu liveries

The game generates original procedural liveries from color palettes and geometric motifs associated broadly with Nairobi matatu art. Available designs include CBD Chrome, Sheng Star, Savannah Pulse, Night Runner, and Green Machine. They are inspired by the energetic color and pattern culture highlighted by [Nganya Kenya](https://www.instagram.com/nganya_kenya/), but do not use copied Instagram photographs, identifiable vehicle paint jobs, artist tags, portraits, logos, or slogans. If you have permission to use a specific reference photo, provide it and we can make a properly credited, authorized skin.

## Run locally

```sh
npm install
npm run dev
```

Optional Google Maps imagery: create a local `.env` (do not commit it) with `VITE_GOOGLE_MAPS_API_KEY=...`; optionally set `VITE_GOOGLE_MAP_ID=...`. Restrict the key by API and web referrers. Google Maps is an optional inset using the official Maps JavaScript API. Google imagery is not scraped, copied, or rendered as Three.js assets.

## Nairobi data

Named roads and mapped building footprints load from OpenStreetMap Overpass at runtime; if the service is unreachable, an offline practice grid keeps the game playable. Route stops include Kencom, Railways, KICC/City Hall Way, Westlands, and Yaya Centre. The game credits OpenStreetMap contributors under the Open Database License (ODbL).

Vehicles, pedestrians, radio tones, fares, traffic behavior, and physics are procedural simulations—not live transit or traffic data. No proprietary Bus Simulator EVO implementation or assets are used.
