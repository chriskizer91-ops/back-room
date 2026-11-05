/* ================= THE BACK ROOM =================
   A smaller room behind the main floor, built with V2's look: glossy black wainscot under a chrome rail,
   ribbed walls under a cove of LED light, an open ceiling with trusses and blacklight tubes.
   You come in by the sealed door from the main floor (front wall). The back wall holds the games in progress;
   the left and right walls are a gallery. In the back right corner is the X Room, a closet of panels about
   what this place is, through a door in its own wall. */
const CL={x:4.2,z:-1.6,dz0:-4.9,dz1:-3.5,t:.16};   // the closet: its west wall at x, its north wall at z, the door's gap in the west wall
const WALLS=[];                                   // interior walls the camera mustn't look through: [x0,x1,z0,z1]
function wallBlock(x0,x1,z0,z1){WALLS.push([Math.min(x0,x1),Math.max(x0,x1),Math.min(z0,z1),Math.max(z0,z1)]);block(x0,x1,z0,z1);}
/* the walking camera stays on the player's side of an interior wall: it slides in along the line to the player */
function camPull(tg,eye){
  if(!WALLS.length)return eye;
  const dx=eye[0]-tg[0],dz=eye[2]-tg[2],L=Math.hypot(dx,dz);if(L<.05)return eye;
  const N=Math.ceil(L/.05),m=.22;let k=1;
  for(let i=1;i<=N;i++){const t=i/N,x=tg[0]+dx*t,z=tg[2]+dz*t;
    if(WALLS.some(w=>x>w[0]-m&&x<w[1]+m&&z>w[2]-m&&z<w[3]+m)){k=(i-1)/N;break;}}
  if(k>=1)return eye;
  k=Math.max(.1,k);const ky=Math.max(.45,k);
  return [tg[0]+dx*k,tg[1]+(eye[1]-tg[1])*ky,tg[2]+dz*k];
}
function buildRoom(){
  const {x0,x1,z0,z1,h}=ROOM,W=WORLD;
  FLOOR.quad([x0,0,z1],[x1,0,z1],[x1,0,z0],[x0,0,z0],[1,1,1]);
  const wall=hex('#1e1731'),rib=hex('#2a2044'),wain=hex('#0a0810'),ceil=hex('#08070c'),soff=hex('#120e1c'),chrome=hex('#c0c6d2'),
    steel=hex('#3a3846'),blk=hex('#060509'),trimP=hex('#ff2f9a'),trimC=hex('#2fe6ff'),uvC=hex('#7a3cff');
  /* the shell */
  W.fin(0,0);
  W.quad([x0,0,z0],[x1,0,z0],[x1,h,z0],[x0,h,z0],wall);
  W.quad([x1,0,z1],[x0,0,z1],[x0,h,z1],[x1,h,z1],wall);
  W.quad([x0,0,z1],[x0,0,z0],[x0,h,z0],[x0,h,z1],wall);
  W.quad([x1,0,z0],[x1,0,z1],[x1,h,z1],[x1,h,z0],wall);
  W.quad([x0,h,z0],[x1,h,z0],[x1,h,z1],[x0,h,z1],ceil);
  const at=(R,s,off,y)=>[R.o[0]+R.d[0]*s+R.n[0]*off,y,R.o[1]+R.d[1]*s+R.n[1]*off];
  const boxAlong=(R,s,len,off,y,hgt,dep,col,e=0)=>{const c=at(R,s+len/2,off+dep/2,y);W.box(c[0],c[1],c[2],Math.abs(R.d[0])*len+Math.abs(R.n[0])*dep,hgt,Math.abs(R.d[1])*len+Math.abs(R.n[1])*dep,col,e);};
  /* one face of a wall, dressed like V2's: wainscot, rail, LED lines, ribs, the cove */
  const dress=R=>{
    const gaps=R.skip||[],free=(a,b)=>!gaps.some(([g0,g1])=>b>g0&&a<g1);
    const segs=[];let s0=0;for(const [g0,g1] of gaps){if(g0>s0)segs.push([s0,g0]);s0=g1;}segs.push([s0,R.L]);
    for(const [a,b] of segs){if(b-a<.05)continue;
      W.fin(.75,0);boxAlong(R,a,b-a,0,.56,1.12,.05,wain);
      W.fin(.9,1);W.tube(at(R,a,.075,1.135),at(R,b,.075,1.135),.018,chrome,0,6);
      W.fin(0,0);W.tube(at(R,a,.055,1.085),at(R,b,.055,1.085),.006,R.cove==='p'?trimP:trimC,2.6);
      W.tube(at(R,a,.04,.05),at(R,b,.04,.05),.007,R.cove==='c'?trimP:trimC,2.2);
      W.fin(.35,0);
      for(let s=a+.3;s<b-.1;s+=.6)if(free(s-.06,s+.06))boxAlong(R,s-.05,.1,0,(1.2+h-.5)/2,h-.5-1.2,.045,rib);
      if(R.cove!=='none'){W.fin(.2,0);boxAlong(R,a,b-a,0,h-.42,.16,.42,soff);
        W.fin(0,0);boxAlong(R,a,b-a,.36,h-.335,.012,.03,R.cove==='v'?hex('#a24bff'):R.cove==='p'?trimP:trimC,3.2);}
    }
  };
  /* the outer walls; the front wall leaves room for the door to the main floor */
  const RUNS=[{o:[x0,z0],d:[1,0],n:[0,1],L:x1-x0,cove:'v'},{o:[x1,z1],d:[-1,0],n:[0,-1],L:x1-x0,cove:'p',skip:[[x1-1.75,x1+1.75]]},
    {o:[x0,z1],d:[0,-1],n:[1,0],L:z1-z0,cove:'c'},{o:[x1,z0],d:[0,1],n:[-1,0],L:z1-z0,cove:'c'}];
  for(const R of RUNS)dress(R);

  /* ---- the X Room's walls: one down from the back wall with a door in it, one across to the right wall ---- */
  {const {x:cx,z:cz,dz0,dz1,t}=CL,ht=t/2,hd=2.45;
    W.fin(.2,0);
    W.box(cx,h/2,(z0+dz0)/2,t,h,dz0-z0,wall);W.box(cx,h/2,(dz1+cz+ht)/2,t,h,cz+ht-dz1,wall);
    W.box(cx,(hd+h)/2,(dz0+dz1)/2,t,h-hd,dz1-dz0,wall);
    W.box((cx+x1)/2,h/2,cz,x1-cx,h,t,wall);
    wallBlock(cx-ht,cx+ht,z0,dz0);wallBlock(cx-ht,cx+ht,dz1,cz+ht);wallBlock(cx,x1,cz-ht,cz+ht);
    const gap=[[dz0-z0,dz1-z0]];
    dress({o:[cx-ht,z0],d:[0,1],n:[-1,0],L:cz+ht-z0,cove:'c',skip:gap});      // the back-room side
    dress({o:[cx+ht,z0],d:[0,1],n:[1,0],L:cz-ht-z0,cove:'c',skip:gap});       // the closet side
    dress({o:[x1,cz+ht],d:[-1,0],n:[0,1],L:x1-cx-ht,cove:'c'});               // the back-room side of the cross wall
    dress({o:[cx+ht,cz-ht],d:[1,0],n:[0,-1],L:x1-cx-ht,cove:'c'});            // the closet side
    /* the door frame: chrome, an LED line round it, and the room's name over it */
    for(const sx of [-1,1]){const fx=cx+sx*(ht+.02);W.fin(.9,1);
      for(const [a,b] of [[[fx,0,dz0],[fx,hd,dz0]],[[fx,0,dz1],[fx,hd,dz1]],[[fx,hd,dz0],[fx,hd,dz1]]])W.tube(a,b,.03,chrome,0,6);
      W.fin(0,0);for(const [a,b] of [[[fx+sx*.03,0,dz0-.06],[fx+sx*.03,hd+.06,dz0-.06]],[[fx+sx*.03,0,dz1+.06],[fx+sx*.03,hd+.06,dz1+.06]],[[fx+sx*.03,hd+.06,dz0-.06],[fx+sx*.03,hd+.06,dz1+.06]]])W.tube(a,b,.01,trimC,3);}
    neon2(W,'X ROOM',[cx-ht-.05,2.62,(dz0+dz1)/2],[0,0,1],.045,hex('#2fe6ff'),4.2);
    lightAt(cx-1,2.4,(dz0+dz1)/2,3.5,[.35,.85,1],.6);
    /* inside: one bare bulb on a cord, a stack of boxes in the corner, a step-stool */
    const bx=(cx+x1)/2+.2,bz=(z0+cz)/2;
    W.fin(0,0);W.tube([bx,h,bz],[bx,h-.85,bz],.006,hex('#222'));W.fin(.6,1);W.cyl(bx,h-.92,bz,.035,.08,10,hex('#3a3428'));W.fin(0,0);W.sphere(bx,h-.98,bz,.06,hex('#ffe2a8'),4,1);
    {const L=lightAt(bx,h-1.1,bz,6.5,[1,.82,.6],1.05);L.hz=.35;}
    const box3=(x,y,z,w,hh,d,c)=>{W.fin(.1,0);W.box(x,y+hh/2,z,w,hh,d,hex(c));W.box(x,y+hh-.005,z,w*.12,.012,d+.004,hex('#c8b48a'));};
    box3(cx+.55,0,cz-.4,.6,.42,.5,'#8a6a42');box3(cx+.58,.42,cz-.43,.5,.36,.44,'#7a5c38');box3(cx+1.2,0,cz-.32,.48,.34,.4,'#94744c');
    block(cx+.1,cx+1.5,cz-.7,cz);
  }

  /* the glow of the cove on the ceiling */
  const glowTex=(col)=>{const c=mkCanvas(4,128),g=c.getContext('2d'),gr=g.createLinearGradient(0,0,0,128);
    gr.addColorStop(0,col);gr.addColorStop(.35,col.replace(/[\d.]+\)$/,'.35)'));gr.addColorStop(1,'rgba(0,0,0,1)');g.fillStyle='#000';g.fillRect(0,0,4,128);g.fillStyle=gr;g.fillRect(0,0,4,128);return texFrom(c,false);};
  const gV=glowTex('rgba(150,70,255,1)'),gC=glowTex('rgba(40,200,255,1)'),gP=glowTex('rgba(255,50,160,1)');
  const ceilGlow=(p0,p1,p2,p3,tex)=>{const m=new MB();m.quad(p0,p1,p2,p3,[1,1,1],0,[[0,1],[1,1],[1,0],[0,0]]);TEXMESH.push({mesh:mesh(m),tex,mode:3,emi:.55,add:true});};
  const yc=h-.004,gw=1.2;
  ceilGlow([x0,yc,z0],[x1,yc,z0],[x1,yc,z0+gw],[x0,yc,z0+gw],gV);
  ceilGlow([x1,yc,z1],[x0,yc,z1],[x0,yc,z1-gw],[x1,yc,z1-gw],gP);
  ceilGlow([x0,yc,z1],[x0,yc,z0],[x0+gw,yc,z0],[x0+gw,yc,z1],gC);
  ceilGlow([x1,yc,z0],[x1,yc,z1],[x1-gw,yc,z1],[x1-gw,yc,z0],gC);

  /* ---- the ceiling: two trusses, a few house lights, blacklight tubes ---- */
  const truss=(ax,az,bx,bz,y,wd)=>{
    const L=Math.hypot(bx-ax,bz-az),ux=(bx-ax)/L,uz=(bz-az)/L,px=-uz,pz=ux,hw=wd/2;
    const P=(s,a,b)=>[ax+ux*s+px*a*hw,y+b*hw,az+uz*s+pz*a*hw];
    W.fin(.55,1);
    for(const [a,b] of [[-1,-1],[1,-1],[1,1],[-1,1]])W.tube(P(0,a,b),P(L,a,b),.02,steel,0,6);
    const n=Math.round(L/wd);
    for(let i=0;i<n;i++){const s=i*L/n,s2=(i+1)*L/n,f=i%2;
      for(const a of [-1,1])W.tube(P(f?s:s2,a,-1),P(f?s2:s,a,1),.009,steel);
      W.tube(P(f?s:s2,-1,-1),P(f?s2:s,1,-1),.009,steel);}
    for(const s of [0,L])for(const a of [-1,1])W.tube(P(s,a,1),[ax+ux*s+px*a*hw,h,az+uz*s+pz*a*hw],.006,hex('#555'));
  };
  const TY=h-.6;
  truss(-8.4,-4.3,3.6,-4.3,TY,.32);truss(-8.4,2.6,8.4,2.6,TY,.32);
  for(const [gx,gz] of [[-6,-1],[-.5,-1],[-3.2,5.4],[5.6,5.4]]){
    W.fin(.2,0);W.box(gx,h-.03,gz,1.4,.04,.5,hex('#fff4ea'),1.2);W.box(gx,h-.06,gz,1.52,.03,.62,blk);
    const L=lightAt(gx,h-.45,gz,7.5,[1,.88,.8],.75);L.hz=.12;}
  for(const [tz,ta,tb] of [[-6,-8.2,3.4],[.8,-8.2,8.2],[6.4,-8.2,8.2]]){
    for(let tx=ta+.7;tx<tb-.5;tx+=2.25){W.fin(.3,1);W.box(tx,h-.1,tz,1.25,.05,.09,steel);W.fin(0,0);W.tube([tx-.58,h-.14,tz],[tx+.58,h-.14,tz],.016,uvC,3.4);}
    UVT.push([ta+.2,tz,tb-.2,tz,.95,2.4]);
  }
  UVT.push([x0+.4,-6,x0+.4,6,.5,1.4],[x1-.4,-1,x1-.4,6,.5,1.4]);

  /* ---- spotlights: a fixture, a beam through the haze, a lit target ---- */
  const spot=(from,to,col,deg,k,o={})=>{
    const d=[to[0]-from[0],to[1]-from[1],to[2]-from[2]],dl=Math.hypot(...d),th=Math.acos(clamp(-d[1]/dl,-1,1)),yaw=Math.atan2(d[0],d[2]);
    W.push();W.tr(...from);W.ry(yaw);W.rx(-th);
    W.fin(.6,1);W.cyl(0,-.28,0,.085,.3,12,hex('#1c1b24'));W.fin(.2,0);W.cyl(0,-.292,0,.07,.012,12,col.map(c=>c),6);
    W.fin(.55,1);W.tube([-.11,.02,0],[-.11,-.16,0],.012,steel);W.tube([.11,.02,0],[.11,-.16,0],.012,steel);W.tube([-.11,.02,0],[.11,.02,0],.012,steel);
    W.pop();
    beamAt(from.slice(),d,deg,dl*1.12,col,k);
    if(o.light!==false){const lp=[to[0]-d[0]/dl*.8,to[1]-d[1]/dl*.8,to[2]-d[2]/dl*.8];const L=lightAt(lp[0],lp[1],lp[2],o.range||3.4,col,o.lk??.7);L.hz=.05;}
    if(o.pool)POOLS.push([to[0],to[2],dl*Math.tan(deg*Math.PI/180)*1.05,o.pool]);
  };
  const SW=[1,.86,.7],PK=[1,.3,.75],CY=[.35,.85,1],AM=[1,.62,.25],VI=[.65,.4,1];
  spot([-4.2,TY-.2,-4.3],[-1.2,3.0,-7.9],PK,6,1.0,{light:false});
  spot([-.6,TY-.2,-4.3],[-3.6,3.0,-7.9],CY,6,1.0,{light:false});
  spot([-6.4,TY-.2,-4.3],[-5,1.2,-7.4],VI,12,.85,{range:4,pool:.4});
  spot([1.8,TY-.2,-4.3],[.2,1.2,-7.3],AM,12,.85,{range:4,pool:.4});
  spot([0,TY-.2,2.6],[0,1.4,7.8],SW,13,.7,{pool:.4,range:4});

  /* ---- the back wall's sign: BACK ROOM over GAMES IN PROGRESS ---- */
  {const sx=-2.4;
    W.fin(.7,0);W.box(sx,2.92,z0+.07,5.2,1.6,.1,hex('#0b0812'));
    W.fin(.9,1);for(const [a,b] of [[[sx-2.6,2.12,z0+.13],[sx+2.6,2.12,z0+.13]],[[sx-2.6,3.72,z0+.13],[sx+2.6,3.72,z0+.13]],[[sx-2.6,2.12,z0+.13],[sx-2.6,3.72,z0+.13]],[[sx+2.6,2.12,z0+.13],[sx+2.6,3.72,z0+.13]]])W.tube(a,b,.028,chrome,0,6);
    W.fin(0,0);
    {const c=mkCanvas(256,80),g=c.getContext('2d'),gr=g.createRadialGradient(128,40,4,128,40,130);gr.addColorStop(0,'rgba(70,20,130,1)');gr.addColorStop(.6,'rgba(26,6,52,1)');gr.addColorStop(1,'rgba(8,4,14,1)');
      g.fillStyle=gr;g.fillRect(0,0,256,80);for(let y=2;y<80;y+=4)for(let x=2;x<256;x+=4){g.fillStyle='rgba(120,220,255,'+(.05+.05*Math.sin(x*.07+y*.11))+')';g.fillRect(x,y,1.4,1.4);}
      const m=new MB();m.quad([sx-2.52,2.2,z0+.125],[sx+2.52,2.2,z0+.125],[sx+2.52,3.64,z0+.125],[sx-2.52,3.64,z0+.125],[1,1,1],0,QUV);TEXMESH.push({mesh:mesh(m),tex:texFrom(c,false),mode:3,emi:.42});}
    neon2(W,'BACK ROOM',[sx,3.0,z0+.17],[1,0,0],.072,hex('#2fe6ff'),4.5);
    neon2(W,'GAMES IN PROGRESS',[sx,2.42,z0+.17],[1,0,0],.034,hex('#ff2f9a'),4.2);
    lightAt(sx,2.9,z0+1.1,6,[.4,.6,1],1.0);
    /* chasing bulbs round the sign */
    const sets=[new MB(),new MB(),new MB()],pts=[];
    for(let x=sx-2.48;x<=sx+2.49;x+=.16)pts.push([x,3.62]);for(let y=3.48;y>=2.3;y-=.16)pts.push([sx+2.48,y]);
    for(let x=sx+2.48;x>=sx-2.49;x-=.16)pts.push([x,2.22]);for(let y=2.36;y<=3.49;y+=.16)pts.push([sx-2.48,y]);
    pts.forEach((p,i)=>sets[i%3].sphere(p[0],p[1],z0+.15,.024,hex('#ffd890'),3.2,0));
    const SM=sets.map(mesh);
    DECO.push({t:0,update(dt){this.t+=dt;},draw(){const k=Math.floor(this.t*7)%3;SM.forEach((m,i)=>drawLit(m,m4(),{emi:i===k?1.5:.12}));}});
  }
  /* the gallery's name on the left wall */
  W.fin(.6,0);W.box(x0+.03,3.16,.4,.06,.42,3.3,hex('#0a0810'));W.fin(0,0);
  neon2(W,'GALLERY',[x0+.08,3.0,.4],[0,0,-1],.05,hex('#ffd23f'),4);lightAt(x0+1.3,2.8,.4,6,[1,.85,.4],.7);

  /* ---- a polished mat at the door, a polished floor in front of the games ---- */
  GLOSS.disc=[0,6.55,1.05,3];
  GLOSS.rects.push([-6.6,-8,1.8,-6.1,1]);
  {const [cx,cz,r]=GLOSS.disc,pts=[];for(let i=0;i<64;i++){const a=i/64*TAU;pts.push([cx+Math.cos(a)*(r+.02),.012,cz+Math.sin(a)*(r+.02)]);}
    W.fin(.9,1);polyTube(W,pts,.02,chrome,0,true);W.fin(0,0);
    const p2=pts.map(p=>[cx+(p[0]-cx)*.985,.016,cz+(p[2]-cz)*.985]);polyTube(W,p2,.008,trimC,3.2,true);}
  {const [a0,b0,a1,b1]=[-6.6,-8,1.8,-6.1];W.fin(.9,1);
    for(const [a,b] of [[[a0,.006,b1],[a1,.006,b1]],[[a0,.006,b0],[a0,.006,b1]],[[a1,.006,b0],[a1,.006,b1]]])W.tube(a,b,.012,chrome,0,6);W.fin(0,0);}

  /* ---- a bench facing the gallery ---- */
  {const bx=-6.7,bz=.4;W.fin(.5,0);W.box(bx,.42,bz,.45,.08,1.8,hex('#2b2040'));W.fin(.9,1);W.box(bx,.21,bz-.78,.4,.42,.06,chrome);W.box(bx,.21,bz+.78,.4,.42,.06,chrome);W.fin(0,0);block(bx-.25,bx+.25,bz-.95,bz+.95);}
  lightAt(-2.4,2.6,1.5,9,[.3,.5,1],.5);lightAt(5,2.6,3.5,8,[.7,.25,1],.5);
}
/* neon text along any wall: c is the centre of the bottom row, right is the reading direction */
function neon2(mb,s,c,right,px,col,glow){
  const cols=s.length*6-1;let gx=0;const lit=new Set();
  for(const ch of s){const g=G5[ch]||G5[' '];for(let r=0;r<7;r++)for(let k=0;k<5;k++)if((g[r]>>(4-k))&1)lit.add((gx+k)+','+r);gx+=6;}
  const P=(k,r)=>[c[0]+right[0]*(k-cols/2)*px,c[1]+(6-r)*px,c[2]+right[2]*(k-cols/2)*px];
  for(const key of lit){
    const [k,r]=key.split(',').map(Number);const a=P(k,r);
    if(lit.has((k+1)+','+r))mb.tube(a,P(k+1,r),px*.26,col,glow);
    if(lit.has(k+','+(r+1)))mb.tube(a,P(k,r+1),px*.26,col,glow);
    if(lit.has((k+1)+','+(r+1))&&!lit.has((k+1)+','+r)&&!lit.has(k+','+(r+1)))mb.tube(a,P(k+1,r+1),px*.26,col,glow);
    if(lit.has((k-1)+','+(r+1))&&!lit.has((k-1)+','+r)&&!lit.has(k+','+(r+1)))mb.tube(a,P(k-1,r+1),px*.26,col,glow);
    mb.box(a[0],a[1],a[2],px*.5,px*.5,px*.5,col,glow);
  }
}
