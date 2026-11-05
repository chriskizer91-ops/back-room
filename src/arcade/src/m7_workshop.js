/* =====================================================================================
   THE WORKSHOP'S CABINETS: each one built to look like its game
   - EnvoiShrine: Envoi on the Longest Night, a moonlit gothic shrine. A pointed arch with gilt trim,
     a rose window, a crescent moon over it, candles on the steps, motes of magic drifting round it,
     and the game's key art on its front.
   - FaireBooth: Moon Faire, a booth at a night faire. A striped tent with a scalloped valance of
     chasing bulbs, a velvet curtain behind a gilt playbill screen, a full moon on the peak, and
     the performers standing either side.
   - HalfBuilt: the next game, a cabinet still being built, with a work light, sawhorses and paint.
   - Workbench: a bench under a pegboard of tools, with a laptop building something.
   ===================================================================================== */
/* a canvas texture: draw(g,w,h) paints it */
function canvasTex(w,h,draw){const c=mkCanvas(w,h),g=c.getContext('2d');draw(g,w,h);return texFrom(c,false);}
/* a decoration: built into the room, never walked up to */
function Decor(build){const a={name:'',sub:'',controls:'none',use:{x:1e9,z:1e9,face:0},idle(){},draw(){},drawScreens(){},build};ATTR.push(a);return a;}
/* small glowing points drawn each frame (motes, bulbs): pos(i,t) gives each one's world position */
function Glints(n,col,r,pos,emi){const m=new MB();m.sphere(0,0,0,r,hex(col),4,0);const M=mesh(m);
  DECO.push({t:0,update(dt){this.t+=dt;},draw(){for(let i=0;i<n;i++){const p=pos(i,this.t);if(!p)continue;drawLit(M,mT(p[0],p[1],p[2]),{emi:emi?emi(i,this.t):1.6});}}});}

/* ---------- Envoi on the Longest Night: the moonlit shrine ---------- */
function EnvoiShrine(o){
  const a=Machine(Object.assign({useZ:1.0},o)),T=a.T;
  const SY=1.3,SW=.6,SH=.3375,FZ=.2;
  a.addScreen(o.game.id,o.res||[320,180],[0,SY,FZ+.03],-.06,SW,SH,{gain:2.3,col:'#d8b8ff'});
  /* the arch: straight sides, then a pointed top */
  const HW=.48,YS=1.95,YA=2.62,arch=(hw,y0,ys,ya)=>{const P=[[-hw,y0],[hw,y0],[hw,ys]];
    for(let i=1;i<14;i++){const u=1-i/14,x=hw*u;P.push([x,ys+(ya-ys)*Math.pow(1-u,.85)*(1-.25*u*u)]);}
    P.push([0,ya]);for(let i=13;i>=1;i--){const u=1-i/14,x=-hw*u;P.push([x,ys+(ya-ys)*Math.pow(1-u,.85)*(1-.25*u*u)]);}
    P.push([-hw,ys]);return P;};
  const OUT=arch(HW,.3,YS,YA),INN=arch(HW-.07,.98,YS-.04,YA-.13);
  const candles=[];
  a.build=mb=>{
    mb.push();mb.m=mmul(mb.m,T);
    const stone=hex('#221a2e'),stone2=hex('#2e2440'),dark=hex('#0c0814'),gold=hex('#d8b25a'),violet=hex('#a678ff');
    /* two stone steps with gilt edges */
    mb.fin(.35,0);mb.box(0,.08,.06,1.36,.16,.98,stone);mb.box(0,.22,.0,1.14,.12,.8,stone2);
    mb.fin(.85,1);mb.tube([-.68,.16,.55],[.68,.16,.55],.008,gold,0,6);mb.tube([-.57,.28,.4],[.57,.28,.4],.008,gold,0,6);
    /* the body: the arch, extruded back from its face */
    mb.fin(.3,0);mb.push();mb.ry(-Math.PI/2);mb.extrudeX(OUT,-.32,FZ,stone);mb.pop();
    /* the recess: a darker arch set into the face, where the screen sits */
    mb.fin(.15,0);mb.push();mb.ry(-Math.PI/2);mb.extrudeX(INN,FZ,FZ+.012,dark);mb.pop();
    /* gilt round the arch and round the recess */
    mb.fin(.85,1);polyTube(mb,OUT.map(p=>[p[0],p[1],FZ+.012]),.016,gold,0,false);polyTube(mb,INN.slice(1).concat([INN[0]]).map(p=>[p[0],p[1],FZ+.016]),.008,gold,.3,false);
    /* pinnacles at the front corners, gold-tipped */
    for(const sx of [-1,1]){const x=sx*(HW+.04);mb.fin(.4,0);mb.cyl(x,.28,FZ-.02,.045,1.78,10,stone2);mb.cyl(x,2.06,FZ-.02,.05,.26,10,stone2,0,0);
      mb.fin(.85,1);mb.sphere(x,2.33,FZ-.02,.026,gold,.6,1);mb.cyl(x,1.22,FZ-.02,.05,.025,10,gold);}
    /* the rose window: a gilt ring and spokes over stained glass */
    const RC=[0,2.14,FZ+.02],RR=.15;
    {const pts=[];for(let i=0;i<32;i++){const t=i/32*TAU;pts.push([RC[0]+Math.cos(t)*RR,RC[1]+Math.sin(t)*RR,RC[2]]);}
      mb.fin(.85,1);polyTube(mb,pts,.012,gold,0,true);
      for(let i=0;i<8;i++){const t=i/8*TAU;mb.tube([RC[0]+Math.cos(t)*.03,RC[1]+Math.sin(t)*.03,RC[2]+.004],[RC[0]+Math.cos(t)*RR,RC[1]+Math.sin(t)*RR,RC[2]+.004],.006,gold);}
      mb.sphere(RC[0],RC[1],RC[2]+.006,.028,gold,.8,1);}
    /* the control ledge: a crystal orb for a stick, two gilt buttons */
    mb.push();mb.tr(0,.98,.3);mb.rx(.32);mb.fin(.35,0);mb.box(0,0,0,.86,.05,.28,stone2);
      mb.fin(.85,1);mb.tube([-.43,.026,.14],[.43,.026,.14],.007,gold,0,6);
      mb.fin(.1,0);mb.cyl(-.2,.025,0,.03,.03,10,gold);mb.sphere(-.2,.085,0,.045,violet,1.8,2);
      mb.fin(.85,1);mb.cyl(.08,.025,.01,.03,.018,14,gold,.5);mb.cyl(.2,.025,-.01,.03,.018,14,gold,.5);mb.pop();
    /* candles on the lower step, three each side */
    for(const sx of [-1,1])for(const [dx,hh] of [[0,.22],[.07,.15],[-.06,.11]]){const x=sx*(.6+dx),z=.38+dx*.4;
      mb.fin(.1,0);mb.cyl(x,.16,z,.024,hh,10,hex('#eadfc4'));mb.fin(0,0);mb.sphere(x,.16+hh+.03,z,.016,hex('#ffb24a'),4,1,1.6);candles.push([x,.16+hh+.03,z]);}
    mb.pop();
    /* the title under the rose window, the key art below the ledge, a star map down each side */
    texQuad(T,[[-.32,1.6,FZ+.016],[.32,1.6,FZ+.016],[.32,1.8,FZ+.016],[-.32,1.8,FZ+.016]],marqueeTex('ENVOI','#120820','#06030e',GRAD.gold,'ON THE LONGEST NIGHT'),1.7);
    const kick={mesh:null,tex:null,mode:3,emi:.95};{const m=new MB();m.m=mmul(m.m,T);m.quad([-.4,.38,FZ+.004],[.4,.38,FZ+.004],[.4,.84,FZ+.004],[-.4,.84,FZ+.004],[1,1,1],0,QUV);kick.mesh=mesh(m);}
    imgCrop(ROOT+'art/envoi-keyart.webp',.8/.46,t=>{kick.tex=t;TEXMESH.push(kick);},1024);
    const stars=canvasTex(128,512,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#1a0f34');gr.addColorStop(.6,'#2a1450');gr.addColorStop(1,'#0c0618');g.fillStyle=gr;g.fillRect(0,0,w,h);
      let sd=3;const R=()=>(sd=(sd*16807)%2147483647)/2147483647;const S=[];for(let i=0;i<70;i++){const x=R()*w,y=R()*h,r=R()<.12?1.8:.8;S.push([x,y]);g.fillStyle='rgba(235,225,255,'+(.4+R()*.6)+')';g.beginPath();g.arc(x,y,r,0,TAU);g.fill();}
      g.strokeStyle='rgba(200,170,255,.35)';g.lineWidth=1;for(let i=0;i<9;i++){const p=S[i*3],q=S[i*3+1],r=S[i*3+2];g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.lineTo(r[0],r[1]);g.stroke();}
      g.fillStyle='rgba(255,236,190,.9)';g.beginPath();g.arc(w*.55,h*.14,16,0,TAU);g.fill();g.fillStyle='#1a0f34';g.beginPath();g.arc(w*.55+7,h*.14-4,14,0,TAU);g.fill();});
    for(const sx of [-1,1]){const x=sx*(HW+.002);texQuad(T,sx<0?[[x,.3,-.32],[x,.3,FZ],[x,YS,FZ],[x,YS,-.32]]:[[x,.3,FZ],[x,.3,-.32],[x,YS,-.32],[x,YS,FZ]],stars,.75);}
    /* the rose window's glass, lit from behind */
    const glass=canvasTex(128,128,(g,w,h)=>{g.fillStyle='#120c1c';g.fillRect(0,0,w,h);const c=w/2,R=60,cols=['#7a3cff','#2f7bff','#ff4fb8','#c9a8ff','#4fe3ff','#ff8a3a','#b47aff','#2fe6ff'];
      for(let i=0;i<8;i++){g.fillStyle=cols[i];g.beginPath();g.moveTo(c,c);g.arc(c,c,R,i/8*TAU,(i+1)/8*TAU);g.closePath();g.fill();}
      for(let i=0;i<8;i++){g.fillStyle=cols[(i+3)%8];g.beginPath();g.arc(c+Math.cos((i+.5)/8*TAU)*R*.68,c+Math.sin((i+.5)/8*TAU)*R*.68,9,0,TAU);g.fill();}
      g.fillStyle='#ffe8b0';g.beginPath();g.arc(c,c,13,0,TAU);g.fill();});
    texQuad(T,[[-.15,1.99,FZ+.014],[.15,1.99,FZ+.014],[.15,2.29,FZ+.014],[-.15,2.29,FZ+.014]],glass,1.5);
    /* the crescent moon over the arch */
    const moon=canvasTex(128,128,(g,w,h)=>{g.fillStyle='#000';g.fillRect(0,0,w,h);const gr=g.createRadialGradient(w/2,h/2,10,w/2,h/2,60);gr.addColorStop(0,'#fff6dc');gr.addColorStop(1,'#ffd890');
      g.fillStyle=gr;g.beginPath();g.arc(w/2,h/2,52,0,TAU);g.fill();g.fillStyle='#000';g.beginPath();g.arc(w/2+24,h/2-14,46,0,TAU);g.fill();});
    const mt=chain(T,mT(0,2.98,-.05));texQuad(mt,[[-.2,-.2,0],[.2,-.2,0],[.2,.2,0],[-.2,.2,0]],moon,2.4);
    const p0=a.W(-.72,0,-.38),p1=a.W(.72,0,.58);block(Math.min(p0[0],p1[0]),Math.max(p0[0],p1[0]),Math.min(p0[2],p1[2]),Math.max(p0[2],p1[2]));
    /* motes of magic drifting up round the arch */
    const MW=(x,y,z)=>a.W(x,y,z);
    Glints(14,'#d8b8ff',.011,(i,t)=>{const k=(t*.09+i/14)%1,ang=i*2.4+t*.35,r=.62+.12*Math.sin(i*1.7+t);return MW(Math.cos(ang)*r,.5+k*2.4,.05+Math.sin(ang)*r*.6);},(i,t)=>{const k=(t*.09+i/14)%1;return 2.4*Math.sin(k*Math.PI);});
    /* the candle flames, each flickering on its own */
    const CW=candles.map(c=>a.W(...c));
    Glints(CW.length,'#ffc066',.014,(i,t)=>CW[i],(i,t)=>2.6+.9*Math.sin(t*13+i*2.1)*Math.sin(t*7.3+i));
  };
  /* the light: violet from the arch, warm from the candles, cool moonlight from above */
  const gp=a.W(0,1.45,.95),glow=lightAt(gp[0],1.45,gp[2],3.4,[.62,.42,1],.85);
  const cl=[-1,1].map(sx=>{const p=a.W(sx*.62,.55,.6);return lightAt(p[0],.55,p[2],1.8,[1,.62,.3],.6);});
  const mp=a.W(0,3.1,.5);lightAt(mp[0],3.1,mp[2],3.2,[.75,.8,1],.55);
  a.onIdle=()=>{glow.k=.78+.1*Math.sin(W_.t*.9);cl.forEach((L,i)=>L.k=.55+.08*Math.sin(W_.t*11+i*3)+.05*Math.sin(W_.t*17.3+i));};
  return a;
}

/* ---------- Moon Faire: the booth at the night faire ---------- */
function FaireBooth(o){
  const a=Machine(Object.assign({useZ:1.25},o)),T=a.T;
  const SY=1.32,SW=.72,SH=.405,SZ=-.33;
  a.addScreen(o.game.id,o.res||[320,180],[0,SY,SZ],0,SW,SH,{gain:2.3,col:'#ffd27a'});
  const CW=.82,CD=.56,CY=2.25,AY=2.95;          // the canopy: half-width, half-depth, eave height, peak height
  const corners=[[-CW,CY,CD],[CW,CY,CD],[CW,CY,-CD],[-CW,CY,-CD]];
  const bulbsA=[],bulbsB=[];
  a.build=mb=>{
    mb.push();mb.m=mmul(mb.m,T);
    const wood=hex('#5a3218'),gold=hex('#e0b04a'),purple=hex('#4a1f7a'),plum=hex('#2e1050'),crimson=hex('#6a0f2a'),crimson2=hex('#4a0a1e'),cream=hex('#f2e6c8');
    /* the stage, with a gilt edge */
    mb.fin(.3,0);mb.box(0,.07,0,1.7,.14,1.2,wood);mb.fin(.85,1);mb.tube([-.85,.14,.6],[.85,.14,.6],.012,gold,0,6);
    /* four posts: the front two striped like a barber's pole */
    for(const [x,z] of [[-.72,.48],[.72,.48],[-.72,-.46],[.72,-.46]]){
      if(z>0)for(let k=0;k<11;k++){mb.fin(.4,0);mb.cyl(x,.14+k*.192,z,.036,.192,12,k%2?gold:purple);}
      else{mb.fin(.4,0);mb.cyl(x,.14,z,.032,2.1,10,plum);}
      mb.fin(.85,1);mb.sphere(x,CY+.02,z,.045,gold,.4,1);}
    /* the velvet curtain behind the screen, in folds, with gilt tie-backs */
    for(let i=0;i<10;i++){const x=-.66+i*.147;mb.fin(.15,0);mb.box(x,1.17,-.44+(i%2)*.025,.15,2.06,.03,i%2?crimson:crimson2);}
    mb.fin(.85,1);for(const sx of [-1,1])mb.tube([sx*.66,1.0,-.4],[sx*.5,1.1,-.38],.012,gold);
    /* the playbill frame round the screen */
    mb.fin(.85,1);const fw=SW/2+.05,fh=SH/2+.05,fz=SZ+.012;
    for(const [p,q] of [[[-fw,SY-fh,fz],[fw,SY-fh,fz]],[[-fw,SY+fh,fz],[fw,SY+fh,fz]],[[-fw,SY-fh,fz],[-fw,SY+fh,fz]],[[fw,SY-fh,fz],[fw,SY+fh,fz]]])mb.tube(p,q,.022,gold,0,6);
    for(const sx of [-1,1])for(const sy of [-1,1])mb.sphere(sx*fw,SY+sy*fh,fz,.032,gold,.3,1);
    mb.fin(.2,0);mb.box(0,SY,SZ-.01,SW+.08,SH+.08,.02,hex('#0a0510'));
    /* the canopy: a peaked tent in purple and gold stripes */
    mb.fin(.12,0);const AP=[0,AY,0],N=6;
    for(let s=0;s<4;s++){const A=corners[s],B=corners[(s+1)%4];
      for(let j=0;j<N;j++){const P0=[A[0]+(B[0]-A[0])*j/N,CY,A[2]+(B[2]-A[2])*j/N],P1=[A[0]+(B[0]-A[0])*(j+1)/N,CY,A[2]+(B[2]-A[2])*(j+1)/N];mb.tri(AP,P0,P1,(j+s)%2?gold:purple,0);}
      /* the valance: scalloped flaps hanging under the eave, a bulb at each point */
      for(let j=0;j<N;j++){const P0=[A[0]+(B[0]-A[0])*j/N,CY,A[2]+(B[2]-A[2])*j/N],P1=[A[0]+(B[0]-A[0])*(j+1)/N,CY,A[2]+(B[2]-A[2])*(j+1)/N];
        const C=[(P0[0]+P1[0])/2,CY,(P0[2]+P1[2])/2],r=Math.hypot(P1[0]-P0[0],P1[2]-P0[2])/2,ux=(P1[0]-P0[0])/(2*r),uz=(P1[2]-P0[2])/(2*r),col=(j+s)%2?purple:gold;
        let prev=P0;for(let k=1;k<=8;k++){const t=Math.PI*k/8,q=[C[0]-ux*r*Math.cos(t),CY-r*Math.sin(t)*.9,C[2]-uz*r*Math.cos(t)];mb.tri(C,prev,q,col,0);prev=q;}
        (j%2?bulbsA:bulbsB).push([P0[0],CY-.01,P0[2]]);}}
    /* the full moon on the peak */
    mb.fin(0,0);mb.sphere(0,AY+.13,0,.13,hex('#fff4d8'),1.9,2);mb.fin(.85,1);mb.cyl(0,AY-.02,0,.012,.05,6,gold);
    /* the name board hanging from the front eave, ringed with bulbs */
    mb.fin(.4,0);mb.box(0,2.03,CD+.02,.98,.3,.03,plum);mb.fin(.85,1);
    for(const [p,q] of [[[-.49,1.88,CD+.04],[.49,1.88,CD+.04]],[[-.49,2.18,CD+.04],[.49,2.18,CD+.04]],[[-.49,1.88,CD+.04],[-.49,2.18,CD+.04]],[[.49,1.88,CD+.04],[.49,2.18,CD+.04]]])mb.tube(p,q,.01,gold,0,6);
    for(let i=0;i<=12;i++){const x=-.47+i*.94/12;(i%2?bulbsA:bulbsB).push([x,2.18,CD+.05],[x,1.88,CD+.05]);}
    /* a ticket podium out front */
    mb.fin(.35,0);mb.box(0,.47,.78,.34,.66,.24,crimson);mb.fin(.85,1);mb.box(0,.81,.78,.4,.03,.3,gold);
    mb.fin(.5,0);mb.cyl(-.07,.825,.8,.025,.018,12,hex('#ffd23f'),1.4);mb.cyl(.07,.825,.8,.025,.018,12,hex('#ff4fb8'),1.4);
    mb.pop();
    texQuad(T,[[-.46,1.9,CD+.036],[.46,1.9,CD+.036],[.46,2.16,CD+.036],[-.46,2.16,CD+.036]],marqueeTex('MOON FAIRE','#2e1050','#12061e',GRAD.gold,'THE PERFORMERS'),1.8);
    /* the performers, standing either side of the booth on cut-out boards */
    for(const [sx,src,w,h] of [[-1,'art/moon-jester.webp',.42,.86],[1,'art/moon-witchfox.webp',.5,.86]]){
      const ST=chain(T,mT(sx*1.18,0,.32),mRY(sx*-.42));
      const m=new MB();m.m=mmul(m.m,ST);m.fin(.4,0);m.box(0,.03,.0,.36,.06,.2,hex('#2e1050'));m.fin(.85,1);m.tube([-w/2-.02,.06,-.01],[w/2+.02,.06,-.01],.01,hex('#e0b04a'),0,6);
      m.fin(.2,0);m.box(0,.08+h/2+.02,-.02,w+.04,h+.04,.02,hex('#140a20'));TEXMESH.push({mesh:mesh(m),tex:null,mode:0});
      const e={mesh:null,tex:null,mode:3,emi:1.05};const q=new MB();q.m=mmul(q.m,ST);q.quad([-w/2,.1,-.008],[w/2,.1,-.008],[w/2,.1+h,-.008],[-w/2,.1+h,-.008],[1,1,1],0,QUV);e.mesh=mesh(q);
      imgCrop(ROOT+src,w/h,t=>{e.tex=t;TEXMESH.push(e);},512);
      const fp=xf(ST,0,0,0);block(fp[0]-.25,fp[0]+.25,fp[2]-.15,fp[2]+.15);}
    const p0=a.W(-.9,0,-.62),p1=a.W(.9,0,.92);block(Math.min(p0[0],p1[0]),Math.max(p0[0],p1[0]),Math.min(p0[2],p1[2]),Math.max(p0[2],p1[2]));
    /* the bulbs chase round: two sets, lit in turn */
    const BA=bulbsA.map(p=>a.W(...p)),BB=bulbsB.map(p=>a.W(...p)),ALL=BA.concat(BB);
    Glints(ALL.length,'#ffe2a0',.02,(i)=>ALL[i],(i,t)=>{const on=Math.floor(t*3.2)%2;return (i<BA.length)===(on===0)?3.2:.35;});
  };
  const gp=a.W(0,1.6,1.0),glow=lightAt(gp[0],1.6,gp[2],3.6,[1,.72,.35],.85);
  const pk=a.W(0,2.4,.2);lightAt(pk[0],2.4,pk[2],2.8,[1,.35,.7],.55);
  a.onIdle=()=>{glow.k=.8+.08*Math.sin(W_.t*3.2*Math.PI);};
  return a;
}

/* ---------- the next game: a cabinet still being built ---------- */
function HalfBuilt(o){
  const T=chain(mT(o.x,0,o.z),mRY(o.ry||0));
  Decor(mb=>{
    mb.push();mb.m=mmul(mb.m,T);
    const pine=hex('#b8925a'),mdf=hex('#9a7e58'),steel=hex('#6a6a74'),dark=hex('#141218');
    /* the frame: the cabinet's outline in bare timber on both sides, rails across */
    for(const sx of [-.33,.33])for(let i=0;i<CAB_PROF.length-1;i++){const A=CAB_PROF[i],B=CAB_PROF[i+1];mb.fin(.15,0);mb.tube([sx,A[1],A[0]],[sx,B[1],B[0]],.022,pine);}
    for(let i=0;i<CAB_PROF.length;i+=2){const A=CAB_PROF[i];mb.tube([-.33,A[1],A[0]],[.33,A[1],A[0]],.018,pine);}
    /* one side panel on, unpainted; the other still to go */
    mb.fin(.1,0);mb.extrudeX(CAB_PROF,-.35,-.33,mdf);
    /* wires hanging where the screen will go */
    for(const [x,c] of [[-.1,'#d8302a'],[0,'#2a2a30'],[.12,'#2a6ad8']]){const pts=[];for(let k=0;k<=8;k++){const t=k/8;pts.push([x+Math.sin(t*3+x*9)*.03,1.62-t*.6,.08+Math.sin(t*Math.PI)*.08]);}polyTube(mb,pts,.006,hex(c));}
    /* a work light clamped on top */
    mb.fin(.6,1);mb.box(0,1.95,.05,.08,.05,.12,steel);mb.push();mb.tr(0,2.0,.12);mb.rx(.9);mb.cyl(0,0,0,.07,.12,12,hex('#d8a020'),0,.04);mb.pop();
    mb.fin(0,0);mb.sphere(0,2.02,.2,.035,hex('#fff2c8'),4,1);
    /* sawhorses with a plank, paint cans, a toolbox */
    for(const zz of [.9,1.7]){mb.fin(.15,0);mb.box(-.85,.62,zz,.62,.05,.06,pine);for(const sx of [-1,1])for(const dz of [-1,1])mb.tube([-.85+sx*.26,.6,zz],[-.85+sx*.3,0,zz+dz*.16],.016,pine);}
    mb.box(-.85,.67,1.3,.24,.03,1.1,pine);
    for(const [x,z,c] of [[.55,.7,'#7a3cff'],[.7,.85,'#ff2f9a'],[.48,.95,'#2fe6ff']]){mb.fin(.6,1);mb.cyl(x,0,z,.09,.2,14,steel);mb.fin(.2,0);mb.cyl(x,.2,z,.092,.012,14,hex(c));}
    mb.fin(.5,0);mb.box(-.85,.78,1.0,.4,.16,.2,hex('#c8302a'));mb.box(-.85,.88,1.0,.2,.03,.04,dark);
    neon2(mb,'NEXT UP',[0,2.3,-.1],[1,0,0],.026,hex('#ffd23f'),4);
    mb.pop();
    const p0=xf(T,-.5,0,-.45),p1=xf(T,.5,0,.4);block(Math.min(p0[0],p1[0]),Math.max(p0[0],p1[0]),Math.min(p0[2],p1[2]),Math.max(p0[2],p1[2]));
    const q0=xf(T,-1.2,0,.75),q1=xf(T,-.5,0,1.9);block(Math.min(q0[0],q1[0]),Math.max(q0[0],q1[0]),Math.min(q0[2],q1[2]),Math.max(q0[2],q1[2]));
  });
  const lp=xf(T,0,1.8,.6);const L=lightAt(lp[0],lp[1],lp[2],3.4,[1,.82,.55],.95);L.hz=.6;
}

/* ---------- the workbench under its pegboard ---------- */
function Workbench(o){
  const T=chain(mT(o.x,0,o.z),mRY(o.ry||0));
  Decor(mb=>{
    mb.push();mb.m=mmul(mb.m,T);
    const top=hex('#7a5232'),leg=hex('#3a3440'),steel=hex('#8a8a96');
    mb.fin(.3,0);mb.box(0,.9,0,2.4,.06,.7,top);for(const sx of [-1.12,1.12])for(const sz of [-.3,.3])mb.box(sx,.45,sz,.06,.9,.06,leg);mb.box(0,.25,-.3,2.24,.04,.04,leg);
    /* a laptop, open, building something */
    mb.fin(.5,1);mb.box(-.45,.94,.05,.42,.02,.28,hex('#2a2a34'));
    mb.push();mb.tr(-.45,.95,-.09);mb.rx(-.25);mb.box(0,.14,0,.42,.28,.015,hex('#2a2a34'));mb.pop();
    /* a lamp, a mug, a stack of cards */
    mb.fin(.7,1);mb.cyl(.7,.93,-.15,.06,.02,12,steel);mb.tube([.7,.95,-.15],[.62,1.35,-.05],.01,steel);mb.tube([.62,1.35,-.05],[.5,1.3,.05],.01,steel);
    mb.cyl(.5,1.22,.05,.05,.08,12,steel,0,.02);mb.fin(0,0);mb.sphere(.5,1.22,.06,.02,hex('#fff0c8'),4,0);
    mb.fin(.3,0);mb.cyl(.25,.93,.12,.04,.1,12,hex('#ff2f9a'));
    for(let i=0;i<4;i++){mb.box(.0+i*.01,.935+i*.008,.15,.16,.008,.1,hex(['#ffd23f','#2fe6ff','#b47aff','#ff7a2e'][i]));}
    mb.pop();
    /* the laptop's screen: a build going */
    const scr=canvasTex(256,160,(g,w,h)=>{g.fillStyle='#04060a';g.fillRect(0,0,w,h);g.font='bold 13px monospace';
      const L=['$ python3 build.py','  m0_room ......... ok','  m4_floor ........ ok','  shaders ......... ok','  cabinets ........ 3/5','  ▌'];L.forEach((s,i)=>{g.fillStyle=i===0?'#ffd23f':'#6dff7a';g.fillText(s,10,22+i*22);});});
    const st=chain(T,mT(-.45,.95,-.09),mRX(-.25));texQuad(st,[[-.19,.02,.009],[.19,.02,.009],[.19,.26,.009],[-.19,.26,.009]],scr,1.6);
    /* the pegboard behind it, with tools hung on it */
    const peg=canvasTex(512,256,(g,w,h)=>{g.fillStyle='#9a7a52';g.fillRect(0,0,w,h);g.fillStyle='rgba(40,26,14,.55)';for(let y=8;y<h;y+=16)for(let x=8;x<w;x+=16){g.beginPath();g.arc(x,y,2.2,0,TAU);g.fill();}
      g.fillStyle='#2a2a34';g.strokeStyle='#2a2a34';g.lineWidth=7;g.lineCap='round';
      g.beginPath();g.moveTo(60,50);g.lineTo(60,180);g.stroke();g.fillRect(36,40,48,22);                       // a hammer
      g.beginPath();g.moveTo(140,40);g.lineTo(140,190);g.stroke();g.beginPath();g.arc(140,40,14,0,TAU);g.stroke();  // a wrench
      g.fillStyle='#c8302a';g.fillRect(205,40,16,60);g.fillStyle='#8a8a96';g.fillRect(210,100,6,90);              // a screwdriver
      g.fillStyle='#8a8a96';g.beginPath();g.moveTo(270,60);g.lineTo(400,60);g.lineTo(400,110);g.lineTo(290,95);g.closePath();g.fill();g.fillStyle='#5a3218';g.fillRect(400,50,40,70); // a saw
      g.strokeStyle='#d8a020';g.lineWidth=5;g.beginPath();g.arc(470,120,30,0,TAU);g.stroke();                       // a coil of cable
      g.fillStyle='#2fe6ff';g.fillRect(300,170,90,10);g.fillStyle='#ffd23f';g.fillRect(300,190,60,10);});            // tape
    texQuad(T,[[-1.2,1.2,-.34],[1.2,1.2,-.34],[1.2,2.4,-.34],[-1.2,2.4,-.34]],peg,.55);
  });
  const lp=xf(T,.5,1.1,.2);lightAt(lp[0],lp[1],lp[2],2.6,[1,.85,.6],.7);
}
