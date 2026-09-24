(function(){
  'use strict';

  var canvas=document.getElementById('earthTiltCanvas');
  var wrap=document.getElementById('tiltCanvasWrap');
  var slider=document.getElementById('tiltDay');
  var playButton=document.getElementById('tiltPlay');
  var fallback=document.getElementById('tiltFallback');
  if(!canvas||!wrap||!slider)return;

  var gl=canvas.getContext('webgl',{alpha:true,antialias:true,depth:true,premultipliedAlpha:false});
  if(!gl){fallback&&fallback.classList.add('visible');return}

  var DEG=Math.PI/180;
  var OBLIQUITY=23.44*DEG;
  var YEAR_DAYS=365.2422;
  var state={day:+slider.value,playing:false,view:'orbit',yaw:-.58,pitch:.38,zoom:1,spin:0,last:performance.now(),pointers:{},pinch:0};

  function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
  function ar(value){return String(value).replace(/[0-9]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'[Number(d)]})}
  function mat4Identity(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}
  function mat4Multiply(a,b){
    var out=new Float32Array(16);
    for(var c=0;c<4;c++)for(var r=0;r<4;r++)out[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];
    return out;
  }
  function mat4Perspective(fov,aspect,near,far){var f=1/Math.tan(fov/2),nf=1/(near-far),out=new Float32Array(16);out[0]=f/aspect;out[5]=f;out[10]=(far+near)*nf;out[11]=-1;out[14]=2*far*near*nf;return out}
  function mat4Translate(x,y,z){var out=mat4Identity();out[12]=x;out[13]=y;out[14]=z;return out}
  function mat4Scale(x,y,z){var out=mat4Identity();out[0]=x;out[5]=y;out[10]=z;return out}
  function mat4RotateX(a){var c=Math.cos(a),s=Math.sin(a),out=mat4Identity();out[5]=c;out[6]=s;out[9]=-s;out[10]=c;return out}
  function mat4RotateY(a){var c=Math.cos(a),s=Math.sin(a),out=mat4Identity();out[0]=c;out[2]=-s;out[8]=s;out[10]=c;return out}
  function mat4RotateZ(a){var c=Math.cos(a),s=Math.sin(a),out=mat4Identity();out[0]=c;out[1]=s;out[4]=-s;out[5]=c;return out}
  function transformPoint(m,p){
    var x=p[0],y=p[1],z=p[2],w=m[3]*x+m[7]*y+m[11]*z+m[15];
    if(!w)w=1;
    return [(m[0]*x+m[4]*y+m[8]*z+m[12])/w,(m[1]*x+m[5]*y+m[9]*z+m[13])/w,(m[2]*x+m[6]*y+m[10]*z+m[14])/w];
  }
  function transformDirection(m,p){return [m[0]*p[0]+m[4]*p[1]+m[8]*p[2],m[1]*p[0]+m[5]*p[1]+m[9]*p[2],m[2]*p[0]+m[6]*p[1]+m[10]*p[2]]}
  function normalize(p){var length=Math.hypot(p[0],p[1],p[2])||1;return[p[0]/length,p[1]/length,p[2]/length]}
  function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]}

  function compile(type,source){var shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));return shader}
  function makeProgram(vertex,fragment){var program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));return program}

  var meshProgram,lineProgram;
  try{
    meshProgram=makeProgram([
      'attribute vec3 aPosition;',
      'attribute vec3 aNormal;',
      'uniform mat4 uMVP;',
      'uniform mat4 uModel;',
      'varying vec3 vNormal;',
      'varying vec3 vObjectNormal;',
      'void main(){',
      '  vObjectNormal=aNormal;',
      '  vNormal=normalize(mat3(uModel)*aNormal);',
      '  gl_Position=uMVP*vec4(aPosition,1.0);',
      '}'
    ].join('\n'),[
      'precision mediump float;',
      'uniform vec4 uColor;',
      'uniform vec3 uLight;',
      'uniform float uKind;',
      'varying vec3 vNormal;',
      'varying vec3 vObjectNormal;',
      'void main(){',
      '  vec3 n=normalize(vNormal);',
      '  if(uKind>1.5){',
      '    float glow=.88+.12*max(n.z,0.0);',
      '    gl_FragColor=vec4(uColor.rgb*glow,uColor.a);',
      '    return;',
      '  }',
      '  float diffuse=max(dot(n,normalize(uLight)),0.0);',
      '  float rim=pow(1.0-abs(n.z),2.35);',
      '  vec3 base=uColor.rgb;',
      '  if(uKind>.5){',
      '    vec3 q=normalize(vObjectNormal);',
      '    float terrain=sin(q.x*10.0+sin(q.z*7.0))*0.62+sin(q.z*14.0-q.y*4.0)*0.43+sin((q.x+q.y)*21.0)*0.22;',
      '    float land=smoothstep(.34,.72,terrain);',
      '    vec3 ocean=mix(vec3(.025,.17,.36),vec3(.03,.36,.57),.5+.5*q.y);',
      '    vec3 ground=mix(vec3(.18,.39,.19),vec3(.55,.43,.20),smoothstep(-.35,.55,q.y));',
      '    base=mix(ocean,ground,land);',
      '    float ice=smoothstep(.78,.94,abs(q.y));',
      '    base=mix(base,vec3(.86,.96,1.0),ice);',
      '  }',
      '  vec3 lit=base*(.13+.87*diffuse)+vec3(.03,.18,.31)*rim*.7;',
      '  gl_FragColor=vec4(lit,uColor.a);',
      '}'
    ].join('\n'));
    lineProgram=makeProgram('attribute vec3 aPosition;uniform mat4 uMVP;void main(){gl_Position=uMVP*vec4(aPosition,1.0);gl_PointSize=3.0;}','precision mediump float;uniform vec4 uColor;void main(){gl_FragColor=uColor;}');
  }catch(error){fallback&&fallback.classList.add('visible');return}

  var meshLoc={position:gl.getAttribLocation(meshProgram,'aPosition'),normal:gl.getAttribLocation(meshProgram,'aNormal'),mvp:gl.getUniformLocation(meshProgram,'uMVP'),model:gl.getUniformLocation(meshProgram,'uModel'),color:gl.getUniformLocation(meshProgram,'uColor'),light:gl.getUniformLocation(meshProgram,'uLight'),kind:gl.getUniformLocation(meshProgram,'uKind')};
  var lineLoc={position:gl.getAttribLocation(lineProgram,'aPosition'),mvp:gl.getUniformLocation(lineProgram,'uMVP'),color:gl.getUniformLocation(lineProgram,'uColor')};
  var lineBuffer=gl.createBuffer();

  function createMesh(vertices,indices){var mesh={vertex:gl.createBuffer(),index:gl.createBuffer(),count:indices.length};gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertex);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mesh.index);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);return mesh}
  function sphere(latitudes,longitudes){
    var vertices=[],indices=[];
    for(var y=0;y<=latitudes;y++){
      var v=y/latitudes,phi=v*Math.PI;
      for(var x=0;x<=longitudes;x++){
        var u=x/longitudes,theta=u*Math.PI*2,nx=Math.sin(phi)*Math.cos(theta),ny=Math.cos(phi),nz=Math.sin(phi)*Math.sin(theta);
        vertices.push(nx,ny,nz,nx,ny,nz);
      }
    }
    for(var j=0;j<latitudes;j++)for(var i=0;i<longitudes;i++){var a=j*(longitudes+1)+i,b=a+longitudes+1;indices.push(a,b,a+1,b,b+1,a+1)}
    return createMesh(vertices,indices);
  }
  var sphereMesh=sphere(30,42);

  var orbitCache=new Map();
  function orbitPoint(angle){var key=angle.toFixed(9);if(orbitCache.has(key))return orbitCache.get(key);var longitude=((angle/DEG+90)%360+360)%360,date=Astronomy.SearchSunLongitude(longitude,new Date('2026-01-01T00:00:00Z'),370).date,radius=3.25*Astronomy.HelioDistance('Earth',date),point=[radius*Math.cos(angle),0,radius*Math.sin(angle)];orbitCache.set(key,point);return point;}
  function orbitAngle(day){return (Astronomy.SunPosition(new Date(Date.UTC(2026,0,1,12)+(day-1)*86400000)).elon-90)*DEG;}
  function axisVector(){return[-Math.sin(OBLIQUITY),Math.cos(OBLIQUITY),0]}
  function earthPoint(){var d=new Date(Date.UTC(2026,0,1,12)+(state.day-1)*86400000),a=orbitAngle(state.day),r=3.25*Astronomy.HelioDistance('Earth',d);return[r*Math.cos(a),0,r*Math.sin(a)];}
  function viewProjection(width,height){return mat4Multiply(mat4Perspective(Math.PI/4,width/Math.max(1,height),.1,60),mat4Translate(0,.05,-8.4))}
  function sceneRoot(){
    var focus=state.view==='earth'?earthPoint():[0,0,0];
    var base=state.view==='earth'?2.25:1;
    var tracking=state.view==='earth'?mat4RotateY(orbitAngle(state.day)):mat4Identity();
    return mat4Multiply(mat4Multiply(mat4RotateX(state.pitch),mat4RotateY(state.yaw)),mat4Multiply(mat4Scale(base*state.zoom,base*state.zoom,base*state.zoom),mat4Multiply(tracking,mat4Translate(-focus[0],-focus[1],-focus[2]))));
  }
  function drawMesh(mesh,model,vp,color,kind,light){
    gl.useProgram(meshProgram);gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertex);gl.enableVertexAttribArray(meshLoc.position);gl.vertexAttribPointer(meshLoc.position,3,gl.FLOAT,false,24,0);gl.enableVertexAttribArray(meshLoc.normal);gl.vertexAttribPointer(meshLoc.normal,3,gl.FLOAT,false,24,12);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mesh.index);gl.uniformMatrix4fv(meshLoc.mvp,false,mat4Multiply(vp,model));gl.uniformMatrix4fv(meshLoc.model,false,model);gl.uniform4fv(meshLoc.color,color);gl.uniform3fv(meshLoc.light,light||[0,1,1]);gl.uniform1f(meshLoc.kind,kind||0);if(color[3]<.99)gl.depthMask(false);gl.drawElements(gl.TRIANGLES,mesh.count,gl.UNSIGNED_SHORT,0);gl.depthMask(true);
  }
  function drawLine(points,model,vp,color,mode){
    var data=new Float32Array(points.length*3);for(var i=0;i<points.length;i++){data[i*3]=points[i][0];data[i*3+1]=points[i][1];data[i*3+2]=points[i][2]}
    gl.useProgram(lineProgram);gl.bindBuffer(gl.ARRAY_BUFFER,lineBuffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(lineLoc.position);gl.vertexAttribPointer(lineLoc.position,3,gl.FLOAT,false,12,0);gl.uniformMatrix4fv(lineLoc.mvp,false,mat4Multiply(vp,model));gl.uniform4fv(lineLoc.color,color);gl.depthMask(false);gl.drawArrays(mode===undefined?gl.LINE_STRIP:mode,0,points.length);gl.depthMask(true);
  }
  function circlePoints(radius,y,count){var points=[];for(var i=0;i<=count;i++){var a=i/count*Math.PI*2;points.push([Math.cos(a)*radius,y,Math.sin(a)*radius])}return points}
  function resized(){
    var rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2),width=Math.max(1,Math.round(rect.width*dpr)),height=Math.max(1,Math.round(rect.height*dpr));
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height)}
    return{width:rect.width,height:rect.height};
  }

  var starPoints=[];for(var si=0;si<165;si++){var sx=((si*83)%331)/331*2-1,sy=((si*191)%337)/337*2-1,sz=((si*47)%347)/347*2-1;var sn=normalize([sx,sy,sz]);starPoints.push([sn[0]*5.4,sn[1]*5.4,sn[2]*5.4])}
  var orbitalPath=[];for(var oi=0;oi<=180;oi++)orbitalPath.push(orbitPoint(orbitAngle(1+oi/180*365.2422)));
  var seasonAngles={summer:0,autumn:Math.PI/2,winter:Math.PI,spring:-Math.PI/2};

  function render(){
    if(!document.getElementById('earth-tilt')?.classList.contains('active'))return;
    var size=resized(),vp=viewProjection(size.width,size.height),root=sceneRoot(),earth=earthPoint(),axis=axisVector();
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.disable(gl.CULL_FACE);

    drawLine(starPoints,root,vp,[.72,.88,1,.43],gl.POINTS);
    drawLine(orbitalPath,root,vp,[.49,.42,.88,.75]);
    drawLine([[-3.8,0,0],[3.8,0,0]],root,vp,[.26,.57,.72,.18]);
    drawLine([[0,0,-3.8],[0,0,3.8]],root,vp,[.26,.57,.72,.18]);
    drawLine(circlePoints(1.65,0,96),root,vp,[.23,.53,.69,.11]);

    Object.keys(seasonAngles).forEach(function(key){
      var p=orbitPoint(seasonAngles[key]);
      var markerBase=mat4Multiply(root,mat4Multiply(mat4Translate(p[0],p[1],p[2]),mat4RotateZ(OBLIQUITY)));
      drawLine([[p[0]-axis[0]*.43,-axis[1]*.43,p[2]],[p[0]+axis[0]*.43,axis[1]*.43,p[2]]],root,vp,[.36,.82,1,.48]);
      drawLine(circlePoints(.13,0,48),markerBase,vp,[.35,.88,.67,.5]);
      drawMesh(sphereMesh,mat4Multiply(markerBase,mat4Scale(.105,.105,.105)),vp,[.45,.85,1,.9],1,normalize(transformDirection(root,normalize([-p[0],0,-p[2]]))));
    });

    var sunModel=mat4Multiply(root,mat4Scale(.56,.56,.56));
    drawMesh(sphereMesh,sunModel,vp,[1,.65,.15,1],2,[0,1,1]);
    drawMesh(sphereMesh,mat4Multiply(root,mat4Scale(.70,.70,.70)),vp,[1,.68,.18,.10],2,[0,1,1]);

    var toSun=normalize([-earth[0],-earth[1],-earth[2]]),light=normalize(transformDirection(root,toSun));
    var northTowardSun=dot(axis,toSun),seasonStrength=clamp(northTowardSun/Math.sin(OBLIQUITY),-1,1),neutral=Math.abs(seasonStrength)<.14;
    for(var ray=-1;ray<=1;ray++){
      var offset=ray*.105;
      drawLine([[earth[0]*.17,offset,earth[2]*.17],[earth[0]-.42*toSun[0],offset,earth[2]-.42*toSun[2]]],root,vp,[1,.72,.23,.24]);
    }
    var earthLocal=mat4Multiply(mat4Translate(earth[0],earth[1],earth[2]),mat4Multiply(mat4RotateZ(OBLIQUITY),mat4Multiply(mat4RotateY(state.spin),mat4Scale(.34,.34,.34))));
    var earthModel=mat4Multiply(root,earthLocal);
    drawMesh(sphereMesh,earthModel,vp,[.04,.31,.56,1],1,light);
    var atmosphereModel=mat4Multiply(root,mat4Multiply(mat4Translate(earth[0],earth[1],earth[2]),mat4Scale(.365,.365,.365)));
    drawMesh(sphereMesh,atmosphereModel,vp,[.18,.72,1,.13],2,light);
    var tiltedBase=mat4Multiply(root,mat4Multiply(mat4Translate(earth[0],earth[1],earth[2]),mat4RotateZ(OBLIQUITY)));
    drawLine(circlePoints(.45,0,72),tiltedBase,vp,[.35,.88,.67,.74]);
    var warm=[1,.72,.23,1],cool=[.28,.72,1,1],even=[.38,.9,.7,1],northColor=neutral?even:(seasonStrength>0?warm:cool),southColor=neutral?even:(seasonStrength>0?cool:warm);
    drawLine([[0,0,0],[0,.82,0]],tiltedBase,vp,northColor);
    drawLine([[0,-.82,0],[0,0,0]],tiltedBase,vp,southColor);
    drawMesh(sphereMesh,mat4Multiply(tiltedBase,mat4Multiply(mat4Translate(0,.83,0),mat4Scale(.052,.052,.052))),vp,northColor,2,light);
    drawMesh(sphereMesh,mat4Multiply(tiltedBase,mat4Multiply(mat4Translate(0,-.83,0),mat4Scale(.044,.044,.044))),vp,southColor,2,light);
    var subsolar=[earth[0]+toSun[0]*.352,earth[1]+toSun[1]*.352,earth[2]+toSun[2]*.352];
    drawMesh(sphereMesh,mat4Multiply(root,mat4Multiply(mat4Translate(subsolar[0],subsolar[1],subsolar[2]),mat4Scale(.031,.031,.031))),vp,[1,.82,.28,1],2,light);
    updateLabels(vp,root,earth,axis,size);
  }

  function placeLabel(element,point,matrix,size,visible){
    if(!element)return;var p=transformPoint(matrix,point),x=(p[0]*.5+.5)*size.width,y=(-p[1]*.5+.5)*size.height,on=visible&&p[2]>-1.2&&p[2]<1.2&&x>-50&&x<size.width+50&&y>-30&&y<size.height+30;element.style.left=x+'px';element.style.top=y+'px';element.style.opacity=on?'1':'0';
  }
  function updateLabels(vp,root,earth,axis,size){
    var matrix=mat4Multiply(vp,root),showOrbit=state.view==='orbit';
    Object.keys(seasonAngles).forEach(function(key){placeLabel(document.querySelector('[data-tilt-marker="'+key+'"]'),orbitPoint(seasonAngles[key]),matrix,size,showOrbit)});
    placeLabel(document.getElementById('tiltPoleLabel'),[earth[0]+axis[0]*.96,earth[1]+axis[1]*.96,earth[2]],matrix,size,true);
  }

  function season(day){var index=Math.floor(((orbitAngle(day)/DEG+90)%360+360)%360/90),name=['الربيع','الصيف','الخريف','الشتاء'][index];return[name+' في النصف الشمالي',name+' الشمالي'];}
  function nearestEvent(day){var events=[{d:79,n:'اعتدال مارس'},{d:172,n:'انقلاب يونيو'},{d:266,n:'اعتدال سبتمبر'},{d:355,n:'انقلاب ديسمبر'}],best=events[0],distance=999;events.forEach(function(event){var delta=Math.abs(day-event.d);delta=Math.min(delta,365-delta);if(delta<distance){distance=delta;best=event}});return(distance<5?'عند ':'قرب ')+best.n}
  function updateReadout(){
    var day=Math.round(state.day),date=new Date(Date.UTC(2026,0,1,12)+(state.day-1)*86400000),dateText=new Intl.DateTimeFormat('ar-SA-u-ca-gregory',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(date),declination=Math.asin(Math.sin(OBLIQUITY)*Math.sin(Astronomy.SunPosition(date).elon*DEG))/DEG,relation=declination>1?'الشمال مائل نحو الشمس':declination<-1?'الشمال مائل بعيدًا عن الشمس':'النصفان يستقبلان ضوءًا متقاربًا',orbit=Astronomy.SunPosition(date).elon;
    document.getElementById('tiltDate').textContent=dateText;document.getElementById('tiltSeason').textContent=season(state.day)[0];document.getElementById('tiltRelation').textContent=relation;document.getElementById('tiltReadingTitle').textContent=nearestEvent(day);document.getElementById('tiltDeclination').textContent=(declination>=0?'+':'−')+ar(Math.abs(declination).toFixed(1).replace('.', '٫'))+'°';document.getElementById('tiltOrbitAngle').textContent=ar(orbit.toFixed(1).replace('.', '٫'))+'°';document.getElementById('tiltDayReadout').textContent='اليوم '+ar(day)+' من ٣٦٥';
    document.querySelectorAll('[data-tilt-day]').forEach(function(button){var diff=Math.abs(day-(+button.dataset.tiltDay));button.classList.toggle('active',Math.min(diff,365-diff)<5)});
  }

  function setDay(day){state.day=clamp(Math.round(day),1,365);slider.value=state.day;updateReadout();render()}
  slider.addEventListener('input',function(){setDay(+slider.value)});
  document.querySelectorAll('[data-tilt-day]').forEach(function(button){button.addEventListener('click',function(){setDay(+button.dataset.tiltDay)})});
  document.querySelectorAll('[data-tilt-view]').forEach(function(button){button.addEventListener('click',function(){state.view=button.dataset.tiltView;state.zoom=1;document.querySelectorAll('[data-tilt-view]').forEach(function(other){other.classList.toggle('active',other===button)});render()})});
  playButton.addEventListener('click',function(){state.playing=!state.playing;playButton.textContent=state.playing?'Ⅱ':'▶';playButton.setAttribute('aria-pressed',String(state.playing));playButton.setAttribute('aria-label',state.playing?'إيقاف دورة الأرض':'تشغيل دورة الأرض حول الشمس')});
  document.getElementById('tiltReset').addEventListener('click',function(){state.yaw=-.58;state.pitch=.38;state.zoom=1;state.view='orbit';document.querySelectorAll('[data-tilt-view]').forEach(function(button){button.classList.toggle('active',button.dataset.tiltView==='orbit')});setDay(Math.floor((Date.now()-Date.UTC(new Date().getUTCFullYear(),0,1))/86400000)+1)});

  function pointerList(){return Object.keys(state.pointers).map(function(id){return state.pointers[id]})}
  canvas.addEventListener('pointerdown',function(event){canvas.setPointerCapture(event.pointerId);state.pointers[event.pointerId]={x:event.clientX,y:event.clientY};var points=pointerList();if(points.length===2)state.pinch=Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y)});
  canvas.addEventListener('pointermove',function(event){var previous=state.pointers[event.pointerId];if(!previous)return;var dx=event.clientX-previous.x,dy=event.clientY-previous.y;state.pointers[event.pointerId]={x:event.clientX,y:event.clientY};var points=pointerList();if(points.length===1){state.yaw+=dx*.008;state.pitch=clamp(state.pitch+dy*.007,-.08,1.12)}else if(points.length===2){var distance=Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y);if(state.pinch)state.zoom=clamp(state.zoom*distance/state.pinch,.68,1.55);state.pinch=distance}render()});
  ['pointerup','pointercancel','lostpointercapture'].forEach(function(type){canvas.addEventListener(type,function(event){delete state.pointers[event.pointerId];state.pinch=0})});
  canvas.addEventListener('wheel',function(event){event.preventDefault();state.zoom=clamp(state.zoom*(event.deltaY>0?.92:1.08),.68,1.55);render()},{passive:false});
  window.addEventListener('resize',render);

  function frame(now){var dt=Math.min(.05,(now-state.last)/1000);state.last=now;var active=document.getElementById('earth-tilt')?.classList.contains('active');if(active){state.spin=(state.spin+dt*(state.playing?2.2:.16))%(Math.PI*2);if(state.playing){state.day+=dt*19;if(state.day>365)state.day=1;slider.value=Math.round(state.day);updateReadout()}render()}requestAnimationFrame(frame)}
  updateReadout();requestAnimationFrame(frame);
  window.earthTilt3D={activate:function(){updateReadout();render()},setDay:setDay};
})();
