"""Hyperdot Arcade, the back room: V2's engine (shell.html, copied here unchanged) with the back room's own modules
dropped in at its markers, and a few small changes made at build time, each one checked to match exactly once.
Writes index.html at the top of the repo.

    python3 src/arcade/build.py

The modules:
  m0_backroom.js   the room: the walls, the X Room's walls and door, the ceiling, the lights, the BACK ROOM sign
  m1_host.js       V2's game host, plus reading cards (panels, pictures) and a chooser for a cabinet with two games
  m2_cabinets.js   V2's cabinets, unchanged (the Upright is used here)
  m3_tables.js     V2's tables, unchanged (the covered machine is used here)
  m6_parts.js      the back room's own machines: the giant handheld, the X Room's panels, the gallery's frames, the sealed door
  m4_backroom.js   the floor plan: what stands where, and the words on the panels

The games, their attract loops and the gallery's pictures sit next to index.html, in games/, attract/ and art/."""
import os
D=os.path.dirname(os.path.abspath(__file__));OUT=os.path.dirname(os.path.dirname(D))
rd=lambda n:open(os.path.join(D,'src',n),encoding='utf-8').read()
s=open(os.path.join(D,'shell.html'),encoding='utf-8').read()
def put(old,new):
    global s
    assert s.count(old)==1,('expected once',old[:70],s.count(old))
    s=s.replace(old,new)
put('/*@@ROOM@@*/',rd('m0_backroom.js'))
put('/*@@MACHINES@@*/','\n'.join(rd(n) for n in ['m1_host.js','m2_cabinets.js','m3_tables.js','m6_parts.js','m7_workshop.js','m4_backroom.js']))
put("/*@@INTRO@@*/'original'","'original'")
put("/*@@ROOT@@*/'../'","''")
put("/*@@DEMO@@*/false",'false')
put('/*@@INTROS@@*/','')
# the room is smaller than the main floor
put('const ROOM={x0:-16,x1:16,z0:-12,z1:12,h:4.6};','const ROOM={x0:-9,x1:9,z0:-16,z1:8,h:4.0};')
# you start just inside the door from the main floor, facing into the room
put('CH_.x=2.4;CH_.z=5.2;','CH_.x=0;CH_.z=5.5;')
# the walking camera doesn't look through the X Room's walls
put('eye[0]=clamp(eye[0],ROOM.x0+.3,ROOM.x1-.3);eye[2]=clamp(eye[2],ROOM.z0+.3,ROOM.z1-.3);',
    'eye[0]=clamp(eye[0],ROOM.x0+.3,ROOM.x1-.3);eye[2]=clamp(eye[2],ROOM.z0+.3,ROOM.z1-.3);eye=camPull(tg,eye);')
# no pinball intro here: the room fades straight in
put('resize();buildFloorAO();','resize();buildFloorAO();PIN.skip();')
put('#skip{position:absolute;','#intro,#skip,#ihint{display:none!important}\n#skip{position:absolute;')
put('<title>Hyperdot Arcade</title>','<title>Hyperdot Arcade · Back Room</title>')
put('aria-label="Hyperdot Arcade 3D view. Power on the pinball machine to begin."','aria-label="Hyperdot Arcade, the back room, 3D view."')
open(os.path.join(OUT,'index.html'),'w',encoding='utf-8').write(s)
print(os.path.join(OUT,'index.html'),len(s.encode()),'bytes')
