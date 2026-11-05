/* ================= the back room's floor plan ================= */
const RX=Math.PI/2;
const G_=(id,title,o={})=>Object.assign({id,title,src:ROOT+'games/'+id+'.html'},o);

/* THE BACK WALL: games in progress, under the BACK ROOM sign */
{const a=Upright({name:'Envoi + Moon Faire',sub:'Two games, one cabinet · pick one',x:-5,z:-7.5,ry:0,res:[320,180],
    game:{id:'envoimoon',title:'Envoi + Moon Faire',deluxe:true,choices:[
      {title:'Envoi on the Longest Night',sub:'A story in chapters · in progress',src:ROOT+'games/envoi.html',bridge:false},
      {title:'Moon Faire',sub:'The performers: the Jester, the Ranger, the Herbal Witch and the Fox · in progress',src:ROOT+'games/moonfaire.html',bridge:false}]},
    marq:'ENVOI + MOON FAIRE',mTop:'#1a0a30',mBot:'#06030e',mCols:GRAD.violet,body:'#120a22',side:'#1c1034',trim:'#c9a8ff',
    art:['#1a0a34','#6a3cc8','#0a0614'],glow:[.6,.45,1],col:'#c9a8ff',ball:'#ffd23f',btnA:'#c9a8ff',btnB:'#ffd23f'});
  /* a moon over the marquee, for the longest night and the faire */
  const b0=a.build;a.build=mb=>{b0(mb);mb.push();mb.m=mmul(mb.m,a.T);mb.fin(0,0);mb.sphere(0,2.06,.08,.13,hex('#fff0c8'),2.2,2);
    for(const [x,y] of [[-.26,2.0],[.27,2.1],[-.18,2.2],[.2,1.96]])mb.sphere(x,y,.1,.014,hex('#ffffff'),4,0);mb.pop();};
  const mp=a.W(0,2.06,.5);lightAt(mp[0],mp[1],mp[2],2.4,[1,.9,.7],.5);}
Handheld({name:'What the Map Forgot',sub:'Handheld adventure · finished',x:.2,z:-7.42,ry:0,res:[192,128],
  game:G_('mapforgot','WHAT THE MAP FORGOT',{bridge:false,deluxe:true})});
/* the next one, under its sheet */
Covered({name:'Next up',x:-8.25,z:-6.3,ry:RX,seed:3.1});
{neon2(WORLD,'NEXT UP',[ROOM.x0+.1,2.5,-6.3],[0,0,-1],.026,hex('#b47aff'),3.6);lightAt(ROOM.x0+1.2,2.3,-6.3,3.5,[.6,.4,1],.55);}

/* THE GALLERY: art from the games, made with AI */
ArtFrame({id:'keyart',name:'Envoi · key art',sub:'Art made with AI',x:ROOM.x0+.04,z:-3.3,ry:RX,src:ROOT+'art/envoi-keyart.webp',w:1.6,h:.9,
  title:'Envoi on the Longest Night',cap:'Key art · made with AI'});
ArtFrame({id:'courtyard',name:'Envoi · the courtyard',sub:'Art made with AI',x:ROOM.x0+.04,z:.4,ry:RX,src:ROOT+'art/envoi-courtyard.webp',w:1.5,h:1.0,
  title:'The courtyard',cap:'From Envoi on the Longest Night · made with AI'});
ArtFrame({id:'village',name:'Envoi · the village',sub:'Art made with AI',x:ROOM.x0+.04,z:4.1,ry:RX,src:ROOT+'art/envoi-village.webp',w:1.4,h:1.05,
  title:'The village at night',cap:'From Envoi on the Longest Night · made with AI'});
ArtFrame({id:'island',name:'The island',sub:'Art made with AI',x:ROOM.x1-.04,z:1.2,ry:-RX,src:ROOT+'art/map-island.webp',w:1.25,h:1.0,
  title:'The island',cap:'From What the Map Forgot · made with AI'});
ArtFrame({id:'coast',name:'The coast town',sub:'Art made with AI',x:ROOM.x1-.04,z:4.6,ry:-RX,src:ROOT+'art/map-coast.webp',w:1.45,h:1.04,
  title:'The coast town',cap:'From What the Map Forgot · made with AI'});
ArtFrame({id:'jester',name:'The Jester',sub:'Art made with AI',x:6.6,z:CL.z+CL.t/2+.01,ry:0,src:ROOT+'art/moon-jester.webp',w:.55,h:1.12,y:1.62,pixel:true,
  title:'The Jester',cap:'From Moon Faire · made with AI'});

/* THE DOOR from the main floor, sealed for now */
SealedDoor({name:'Main floor',sub:'Connecting soon',x:0,z:ROOM.z1-.04,ry:Math.PI});

/* THE X ROOM: five panels about what this is. Drafted from Christopher's own words; his to rewrite. */
Panel({id:'what',name:'What this is',sub:'Panel 1 of 5',x:5.6,z:ROOM.z0+.02,ry:0,title:'What this is',body:[
  'Hyperdot Arcade is a walkable arcade I built in the autumn of 2026. Every cabinet is a real game, and every game is its own web page, so a lot of people can be here at once.',
  'It started with a pinball machine. Part of the pinball game became a dot-matrix screen, and that screen became the whole idea.',
  'I can’t write code. I built all of it by talking with an AI.']});
Panel({id:'collab',name:'Collaboration + augmentation',sub:'Panel 2 of 5',x:7.8,z:ROOM.z0+.02,ry:0,col:'#ff2f9a',cols:GRAD.pink,title:'Collaboration + augmentation',body:[
  'I think of AI as both a collaborator and an augmentation: a partner and an assistant fused together. That picture might come from the Halo games I grew up with.',
  'Claude wrote the functions that make this a space. I decided what the space should be, tested it, and kept the back and forth going until it felt right.']});
Panel({id:'mine',name:'The part that’s mine',sub:'Panel 3 of 5',x:ROOM.x1-.02,z:-5.6,ry:-RX,col:'#ffd23f',cols:GRAD.gold,title:'The part that’s mine',body:[
  'Making the code isn’t the hard part anymore. Knowing what’s worth building is.',
  'It can’t be a one-off. It has to be a back and forth, testing the thing for real: playing the game, or checking my watering software against how I actually water.',
  'The discernment and the motivation are what I bring.']});
Panel({id:'future',name:'The future of media',sub:'Panel 4 of 5',x:ROOM.x1-.02,z:-3.4,ry:-RX,col:'#b47aff',cols:GRAD.violet,title:'The future of media',body:[
  'Software that used to be worth hundreds of thousands of dollars can now be made for one person and one need.',
  'A business card with a QR code can open a whole 3D space. Games can live inside a game.',
  'I think this is it. I feel empowered by it, genuinely.']});
Panel({id:'open',name:'Open by design',sub:'Panel 5 of 5',x:6.4,z:CL.z-CL.t/2-.01,ry:Math.PI,col:'#6dff7a',cols:GRAD.green,title:'Open by design',body:[
  'This arcade is public on purpose. I want people to see what one person and an AI can make together, and how.',
  'Saying out loud that AI helped me make this is the best voice I can have for it going in a beneficial direction.',
  'The back room is where games live while they’re still being built.']});
