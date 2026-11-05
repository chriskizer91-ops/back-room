# Hyperdot Arcade: the back room

The back room of [Hyperdot Arcade](https://github.com/chriskizer91-ops/HYPERDOT-ARCADE), in a repo of its own for now. The arcade itself (V1 and V2) is unchanged. When the door between them opens, this folder moves into the arcade's repo, next to `v2/`.

It runs on V2's engine: the same renderer, the same walking, the same cabinets. It has no pinball intro. You start just inside the door from the main floor.

## What's in it

| Where | What |
|---|---|
| Front wall | **The door to the main floor.** Frosted glass with the floor's neon behind it, under a MAIN FLOOR sign. It's sealed for now (CONNECTING SOON), and LOOK explains that. |
| Back wall, under BACK ROOM · GAMES IN PROGRESS | **Envoi + Moon Faire**: one cabinet, two games. Sitting down shows a choice between *Envoi on the Longest Night* and *Moon Faire*. Next to it is **What the Map Forgot**, a giant handheld on a pedestal, built after the game's own handheld. In the corner is a machine under a sheet (NEXT UP). |
| Left wall, the GALLERY | Three framed pictures from Envoi. |
| Right wall | Two from What the Map Forgot. The Jester from Moon Faire hangs on the X Room's wall. |
| Back right corner | **The X Room**, a closet through its own door. It holds five lit panels: What this is, Collaboration + augmentation, The part that's mine, The future of media, and Open by design. |

Every picture and panel works like a machine. Walk up and press VIEW or READ (E or Enter). The picture or the words open full size, and ← Arcade (or Esc) brings you back.

## The games

`games/envoi.html`, `games/moonfaire.html` and `games/mapforgot.html` are the builds as Christopher shared them, unchanged. None of them speaks the cabinet contract yet. The cabinet is told so (`bridge:false`), and it lifts its loading screen as soon as the game's page has loaded. They don't award tickets. Leaving works as for any game: hold Esc, or the ← Arcade pill.

To update a game, replace its file in `games/`.

## Changing things

- **The words on the panels** are at the bottom of `src/arcade/src/m4_backroom.js`, one `Panel({...})` each. They were drafted from Christopher's own words and are his to rewrite.
- **A picture**: put the image in `art/` and add an `ArtFrame({...})` line in the same file, with its width and height in metres.
- **The two-game cabinet** is the `Upright({... choices:[...]})` at the top of that file. A third game is a third entry in `choices`.

Then build:

```
python3 src/arcade/build.py
```

That writes `index.html` from V2's `shell.html` (copied into `src/arcade/` unchanged) and the modules in `src/arcade/src/`:

| Module | What it is |
|---|---|
| `m0_backroom.js` | the room: the walls, the X Room's walls and door, the ceiling, the lights, the signs |
| `m1_host.js` | V2's game host, plus reading cards (panels, pictures, the door) and the chooser for a cabinet with more than one game |
| `m2_cabinets.js`, `m3_tables.js` | V2's cabinets and tables, unchanged |
| `m6_parts.js` | the back room's own machines: the giant handheld, the panels, the frames, the sealed door |
| `m4_backroom.js` | the floor plan |

`build.py` also makes a few small changes to the shell, and checks that each one matches exactly once:
- the room's size
- where you start
- no intro
- the camera stays on your side of the X Room's walls

## Run it

Serve the folder over HTTP (any static server works) and open it:

```
python3 -m http.server 8000
# then open http://localhost:8000/
```

GitHub Pages works as is. The `.nojekyll` file stops Pages from processing the folder.

## Tickets

The back room shares V2's wallet (`arcade2-tickets`), so whatever you win in one is there in the other once the door opens.
