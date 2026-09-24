/* Geometric sky positions; fixed J2000 stars, precession/nutation via Astronomy Engine. */
(function(root){
'use strict';
const A=root.Astronomy,D=Math.PI/180;
const norm=p=>{const d=Math.hypot(...p);return p.map(x=>x/d);};
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const mod=(x,n=360)=>(x%n+n)%n;
function equatorial(ra,dec){return [Math.cos(dec*D)*Math.cos(ra*D),Math.cos(dec*D)*Math.sin(ra*D),Math.sin(dec*D)];}
function rotate(matrix,p,date){const v=A.RotateVector(matrix,new A.Vector(...p,date));return [v.x,v.y,v.z];}
function angles(p){const u=norm(p);return {altitude:Math.asin(Math.max(-1,Math.min(1,u[2])))/D,azimuth:mod(Math.atan2(-u[1],u[0])/D)};}
function frame(date,loc){return {date,loc,observer:new A.Observer(loc.lat,loc.lon,loc.elevation||0),hor:A.Rotation_EQJ_HOR(date,new A.Observer(loc.lat,loc.lon,loc.elevation||0)),ecl:A.Rotation_ECT_EQJ(date)};}
function star(star,f){const p=rotate(f.hor,equatorial(star.ra,star.dec),f.date);return {...angles(p),p};}
function point(ra,dec,f){return rotate(f.hor,equatorial(ra,dec),f.date);}
function ecliptic(lon,lat,f){const p=rotate(f.ecl,equatorial(lon,lat),f.date);return rotate(f.hor,p,f.date);}
function body(name,f){const e=A.Equator(name,f.date,f.observer,true,true),h=A.Horizon(f.date,f.observer,e.ra,e.dec);const p=[Math.cos(h.altitude*D)*Math.cos(h.azimuth*D),-Math.cos(h.altitude*D)*Math.sin(h.azimuth*D),Math.sin(h.altitude*D)];return {...h,p};}
function lunarPlane(f){
 const s=A.GeoMoonState(f.date),r=norm([s.x,s.y,s.z]),n=norm(cross(r,[s.vx,s.vy,s.vz])),t=norm(cross(n,r));
 const en=rotate(f.ecl,[0,0,1],f.date),inclination=Math.acos(Math.max(-1,Math.min(1,dot(n,en))))/D;
 const path=[];for(let i=0;i<=180;i++){const a=i*Math.PI/90;path.push(rotate(f.hor,r.map((v,j)=>v*Math.cos(a)+t[j]*Math.sin(a)),f.date));}
 const node=norm(cross(en,n));
 // Arc across both planes perpendicular to their line of intersection.
 const v=norm(cross(en,node)),w=norm(cross(n,node)),arc=[];
 for(let i=0;i<=24;i++)arc.push(rotate(f.hor,norm(v.map((x,j)=>x*(1-i/24)+w[j]*i/24)),f.date));
 return {path,inclination,arc,label:arc[12]};
}
function solarIdentity(date){const p=A.GeoVector('Sun',date,true),eq=A.EquatorFromVector(p),c=A.Constellation(eq.ra,eq.dec),lon=A.SunPosition(date).elon;return {constellation:c.symbol,sign:Math.floor(mod(lon)/30),longitude:lon};}
function starEvents(s,date,loc){
 // Geometric centre crossings of a flat horizon, over the NEXT 24 hours.
 const at=t=>star(s,frame(new Date(t),loc)).altitude,start=+date,end=start+86400000,step=600000;
 let before=at(start),rise=null,set=null,min=before,max=before;
 for(let t=start+step;t<=end;t+=step){const after=at(t);min=Math.min(min,after);max=Math.max(max,after);
  if((before<=0&&after>0)||(before>=0&&after<0)){
   let lo=t-step,hi=t;const rising=after>before;
   for(let i=0;i<20;i++){const mid=(lo+hi)/2,alt=at(mid);if((alt>0)===rising)hi=mid;else lo=mid;}
   if(rising&&!rise)rise=new Date((lo+hi)/2);if(!rising&&!set)set=new Date((lo+hi)/2);
  }before=after;
 }
 return {rise,set,alwaysUp:min>0,alwaysDown:max<0};
}
root.ZodiacCalc={D,norm,dot,cross,mod,equatorial,rotate,angles,frame,star,point,ecliptic,body,lunarPlane,solarIdentity,starEvents};
})(globalThis);
