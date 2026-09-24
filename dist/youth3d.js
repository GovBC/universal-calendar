(function(){
  'use strict';

  var canvas=document.getElementById('youthEsophagus3DCanvas');
  var wrap=canvas&&canvas.closest('.youth-canvas-wrap');
  var labelLayer=document.getElementById('youth3DLabelLayer');
  var stageRail=document.getElementById('youth3DStageRail');
  var counts=document.getElementById('youth3DCounts');
  var tissueKey=document.getElementById('youthTissueKey');
  var playButton=document.getElementById('youthGrowthPlay');
  var fallback=document.getElementById('youth3DFallback');
  var slider=document.getElementById('youthStageSlider');
  var cellCount=document.getElementById('youthCellCount');
  var layerCount=document.getElementById('youthLayerCount');
  if(!canvas||!wrap||!slider)return;

  var gl=canvas.getContext('webgl',{alpha:true,antialias:true,depth:true,premultipliedAlpha:false});
  if(!gl){
    fallback&&fallback.classList.add('visible');
    return;
  }

  var stages=[
    {name:'خلية جذعية واحدة',short:'iPSC والتوسع النسيلي',meta:'خلية واحدة تنقسم إلى مستعمرة من الخلايا المستحثة متعددة القدرات'},
    {name:'الأديم الباطن النهائي',short:'تحديد السلالة الجنينية',meta:'توجيه الخلايا نحو الأديم الباطن الذي تنشأ منه بطانة المريء'},
    {name:'السلف المريئي',short:'المعي الأمامي والهوية المريئية',meta:'تكوين خلايا سلفية للظهارة المريئية وتنظيمها حول لمعة ناشئة'},
    {name:'العضية والهيكل الحيوي',short:'تجميع الطبقات والتروية',meta:'عضية مريئية على هيكل داعم مع خلايا عضلية وسدية ووعائية'},
    {name:'النضج متعدد الطبقات',short:'حاجز وحركة واختبار',meta:'نموذج بحثي متعدد الطبقات مع تروية واختبارات وظيفية'}
  ];

  var state={active:true,progress:0,playing:false,yaw:-0.48,pitch:0.17,zoom:1,time:0,dragging:false,x:0,y:0,lastFrame:performance.now()};
  var labelNodes=[];
  var stageButtons=Array.prototype.slice.call(document.querySelectorAll('[data-youth-3d-stage]'));

  function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
  function mix(a,b,t){return a+(b-a)*t}
  function smooth(t){t=clamp(t,0,1);return t*t*(3-2*t)}
  function rand(n){var x=Math.sin(n*12.9898+78.233)*43758.5453;return x-Math.floor(x)}
  function arNumber(value){return String(value).replace(/[0-9]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'[Number(d)]})}

  function mat4Identity(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}
  function mat4Multiply(a,b){
    var out=new Float32Array(16);
    for(var c=0;c<4;c++)for(var r=0;r<4;r++)out[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];
    return out;
  }
  function mat4Perspective(fov,aspect,near,far){
    var f=1/Math.tan(fov/2),nf=1/(near-far),out=new Float32Array(16);
    out[0]=f/aspect;out[5]=f;out[10]=(far+near)*nf;out[11]=-1;out[14]=2*far*near*nf;
    return out;
  }
  function mat4Translate(x,y,z){var out=mat4Identity();out[12]=x;out[13]=y;out[14]=z;return out}
  function mat4Scale(x,y,z){var out=mat4Identity();out[0]=x;out[5]=y;out[10]=z;return out}
  function mat4RotateX(a){var c=Math.cos(a),s=Math.sin(a),out=mat4Identity();out[5]=c;out[6]=s;out[9]=-s;out[10]=c;return out}
  function mat4RotateY(a){var c=Math.cos(a),s=Math.sin(a),out=mat4Identity();out[0]=c;out[2]=-s;out[8]=s;out[10]=c;return out}
  function transformPoint(m,p){
    var x=p[0],y=p[1],z=p[2],w=m[3]*x+m[7]*y+m[11]*z+m[15]||1;
    return [(m[0]*x+m[4]*y+m[8]*z+m[12])/w,(m[1]*x+m[5]*y+m[9]*z+m[13])/w,(m[2]*x+m[6]*y+m[10]*z+m[14])/w];
  }

  function shader(type,source){
    var s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function program(vertex,fragment){
    var p=gl.createProgram();gl.attachShader(p,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(p,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(p);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));
    return p;
  }

  var meshProgram=program([
    'attribute vec3 aPosition;',
    'attribute vec3 aNormal;',
    'uniform mat4 uMVP;',
    'uniform mat4 uModel;',
    'varying vec3 vNormal;',
    'varying vec3 vWorld;',
    'void main(){',
    '  vec4 world=uModel*vec4(aPosition,1.0);',
    '  vWorld=world.xyz;',
    '  vNormal=normalize(mat3(uModel)*aNormal);',
    '  gl_Position=uMVP*vec4(aPosition,1.0);',
    '}'
  ].join('\n'),[
    'precision mediump float;',
    'uniform vec4 uColor;',
    'varying vec3 vNormal;',
    'varying vec3 vWorld;',
    'void main(){',
    '  vec3 n=normalize(vNormal);',
    '  vec3 light=normalize(vec3(-0.42,0.72,0.84));',
    '  float diffuse=max(dot(n,light),0.0);',
    '  float back=max(dot(n,-light),0.0)*0.12;',
    '  float rim=pow(1.0-abs(n.z),2.2);',
    '  float micro=0.965+0.035*sin(vWorld.y*41.0+vWorld.x*17.0)*sin(vWorld.z*29.0-vWorld.y*7.0);',
    '  vec3 color=uColor.rgb*(0.27+0.73*diffuse+back)*micro+vec3(1.0,0.56,0.48)*rim*0.12;',
    '  gl_FragColor=vec4(color,uColor.a);',
    '}'
  ].join('\n'));

  var pointProgram=program([
    'attribute vec3 aPosition;',
    'attribute vec3 aColor;',
    'attribute float aSize;',
    'uniform mat4 uMVP;',
    'uniform float uPointScale;',
    'varying vec3 vColor;',
    'void main(){',
    '  vec4 clip=uMVP*vec4(aPosition,1.0);',
    '  gl_Position=clip;',
    '  gl_PointSize=clamp(aSize*uPointScale/max(1.0,clip.w),2.0,34.0);',
    '  vColor=aColor;',
    '}'
  ].join('\n'),[
    'precision mediump float;',
    'varying vec3 vColor;',
    'void main(){',
    '  vec2 q=gl_PointCoord*2.0-1.0;',
    '  float d=dot(q,q);',
    '  if(d>1.0)discard;',
    '  float z=sqrt(max(0.0,1.0-d));',
    '  float light=0.35+0.65*max(dot(normalize(vec3(q,z)),normalize(vec3(-0.35,0.45,1.0))),0.0);',
    '  float edge=smoothstep(1.0,0.72,d);',
    '  gl_FragColor=vec4(vColor*light+vec3(0.15,0.055,0.07)*(1.0-z),edge);',
    '}'
  ].join('\n'));

  var lineProgram=program([
    'attribute vec3 aPosition;',
    'uniform mat4 uMVP;',
    'void main(){gl_Position=uMVP*vec4(aPosition,1.0);}'
  ].join('\n'),[
    'precision mediump float;',
    'uniform vec4 uColor;',
    'void main(){gl_FragColor=uColor;}'
  ].join('\n'));

  var meshLocations={
    position:gl.getAttribLocation(meshProgram,'aPosition'),
    normal:gl.getAttribLocation(meshProgram,'aNormal'),
    mvp:gl.getUniformLocation(meshProgram,'uMVP'),
    model:gl.getUniformLocation(meshProgram,'uModel'),
    color:gl.getUniformLocation(meshProgram,'uColor')
  };
  var pointLocations={
    position:gl.getAttribLocation(pointProgram,'aPosition'),
    color:gl.getAttribLocation(pointProgram,'aColor'),
    size:gl.getAttribLocation(pointProgram,'aSize'),
    mvp:gl.getUniformLocation(pointProgram,'uMVP'),
    pointScale:gl.getUniformLocation(pointProgram,'uPointScale')
  };
  var lineLocations={
    position:gl.getAttribLocation(lineProgram,'aPosition'),
    mvp:gl.getUniformLocation(lineProgram,'uMVP'),
    color:gl.getUniformLocation(lineProgram,'uColor')
  };

  function createMesh(vertices,indices){
    var mesh={vertex:gl.createBuffer(),index:gl.createBuffer(),count:indices.length};
    gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertex);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mesh.index);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
    return mesh;
  }

  function makeSphere(latitudes,longitudes){
    var vertices=[],indices=[];
    for(var y=0;y<=latitudes;y++){
      var v=y/latitudes,phi=v*Math.PI;
      for(var x=0;x<=longitudes;x++){
        var u=x/longitudes,theta=u*Math.PI*2,nx=Math.sin(phi)*Math.cos(theta),ny=Math.cos(phi),nz=Math.sin(phi)*Math.sin(theta);
        vertices.push(nx,ny,nz,nx,ny,nz);
      }
    }
    for(var j=0;j<latitudes;j++)for(var i=0;i<longitudes;i++){
      var a=j*(longitudes+1)+i,b=a+longitudes+1;
      indices.push(a,b,a+1,b,b+1,a+1);
    }
    return createMesh(vertices,indices);
  }

  function curveCenter(v,length){
    var y=(v-.5)*length;
    return [Math.sin((v-.42)*Math.PI*1.55)*.18,y,Math.sin(v*Math.PI*2.15)*.075];
  }

  function makeShell(innerRadius,outerRadius){
    var length=4.7,longitudes=46,radials=26,opening=1.02,start=opening*.5,span=Math.PI*2-opening,ring=radials+1,vertices=[],indices=[];
    function surface(radius,inward){
      var base=vertices.length/6;
      for(var y=0;y<=longitudes;y++){
        var v=y/longitudes,c=curveCenter(v,length);
        for(var x=0;x<=radials;x++){
          var theta=start+x/radials*span,nx=Math.cos(theta),nz=Math.sin(theta),direction=inward?-1:1;
          var lumenFold=inward&&innerRadius<.36?.038*Math.cos(theta*7)*(0.72+.28*Math.sin(v*Math.PI)):0;
          var organic=.006*Math.sin(theta*5.0+v*19.0)*Math.sin(v*31.0),surfaceRadius=radius+lumenFold+organic;
          vertices.push(c[0]+nx*surfaceRadius,c[1],c[2]+nz*surfaceRadius,nx*direction,0,nz*direction);
        }
      }
      return base;
    }
    var outer=surface(outerRadius,false),inner=surface(innerRadius,true);
    for(var y=0;y<longitudes;y++)for(var x=0;x<radials;x++){
      var a=outer+y*ring+x,b=a+ring,ai=inner+y*ring+x,bi=ai+ring;
      indices.push(a,b,a+1,b,b+1,a+1);
      indices.push(ai,ai+1,bi,bi,ai+1,bi+1);
    }
    for(var yi=0;yi<longitudes;yi++){
      var o0=outer+yi*ring,o1=o0+ring,i0=inner+yi*ring,i1=i0+ring;
      indices.push(o0,i0,o1,o1,i0,i1);
      var or0=o0+radials,or1=o1+radials,ir0=i0+radials,ir1=i1+radials;
      indices.push(or0,or1,ir0,or1,ir1,ir0);
    }
    for(var xj=0;xj<radials;xj++){
      var topO=outer+xj,topI=inner+xj,bottomO=outer+longitudes*ring+xj,bottomI=inner+longitudes*ring+xj;
      indices.push(topO,topO+1,topI,topO+1,topI+1,topI);
      indices.push(bottomO,bottomI,bottomO+1,bottomO+1,bottomI,bottomI+1);
    }
    return createMesh(vertices,indices);
  }

  var sphereMesh=makeSphere(16,22);
  var layerMeshes=[
    {mesh:makeShell(.35,.385),color:[.94,.56,.57,1],name:'الظهارة الحرشفية',mainLayer:0},
    {mesh:makeShell(.385,.41),color:[.91,.68,.58,1],name:'الصفيحة الخاصة',mainLayer:0},
    {mesh:makeShell(.41,.43),color:[.72,.30,.33,1],name:'العضلية المخاطية',mainLayer:0},
    {mesh:makeShell(.43,.54),color:[.89,.59,.52,1],name:'النسيج تحت المخاطي',mainLayer:1},
    {mesh:makeShell(.54,.66),color:[.66,.21,.24,1],name:'العضلة الدائرية',mainLayer:2},
    {mesh:makeShell(.66,.78),color:[.50,.12,.17,1],name:'العضلة الطولية',mainLayer:2},
    {mesh:makeShell(.78,.85),color:[.68,.39,.36,1],name:'الغلالة الخارجية',mainLayer:3}
  ];
  var pointBuffer=gl.createBuffer(),lineBuffer=gl.createBuffer();

  function modelMatrix(scale){
    var rotation=mat4Multiply(mat4RotateX(state.pitch),mat4RotateY(state.yaw));
    return mat4Multiply(rotation,mat4Scale(scale*state.zoom,scale*state.zoom,scale*state.zoom));
  }
  function viewProjection(width,height){
    var projection=mat4Perspective(Math.PI/4,width/Math.max(1,height),.1,50);
    return mat4Multiply(projection,mat4Translate(0,0,-7.2));
  }
  function drawMesh(mesh,model,vp,color){
    var mvp=mat4Multiply(vp,model);
    gl.useProgram(meshProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertex);
    gl.enableVertexAttribArray(meshLocations.position);gl.vertexAttribPointer(meshLocations.position,3,gl.FLOAT,false,24,0);
    gl.enableVertexAttribArray(meshLocations.normal);gl.vertexAttribPointer(meshLocations.normal,3,gl.FLOAT,false,24,12);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mesh.index);
    gl.uniformMatrix4fv(meshLocations.mvp,false,mvp);gl.uniformMatrix4fv(meshLocations.model,false,model);gl.uniform4fv(meshLocations.color,color);
    if(color[3]<.99)gl.depthMask(false);
    gl.drawElements(gl.TRIANGLES,mesh.count,gl.UNSIGNED_SHORT,0);
    gl.depthMask(true);
  }

  function drawCells(cells,model,vp,width,height){
    if(!cells.length)return;
    var data=new Float32Array(cells.length*7);
    for(var i=0;i<cells.length;i++){
      var c=cells[i],o=i*7;data[o]=c.x;data[o+1]=c.y;data[o+2]=c.z;data[o+3]=c.r;data[o+4]=c.g;data[o+5]=c.b;data[o+6]=c.size;
    }
    gl.useProgram(pointProgram);gl.bindBuffer(gl.ARRAY_BUFFER,pointBuffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(pointLocations.position);gl.vertexAttribPointer(pointLocations.position,3,gl.FLOAT,false,28,0);
    gl.enableVertexAttribArray(pointLocations.color);gl.vertexAttribPointer(pointLocations.color,3,gl.FLOAT,false,28,12);
    gl.enableVertexAttribArray(pointLocations.size);gl.vertexAttribPointer(pointLocations.size,1,gl.FLOAT,false,28,24);
    gl.uniformMatrix4fv(pointLocations.mvp,false,mat4Multiply(vp,model));
    gl.uniform1f(pointLocations.pointScale,Math.min(width,height)*.13);
    gl.depthMask(false);gl.drawArrays(gl.POINTS,0,cells.length);gl.depthMask(true);
  }

  function drawLine(points,model,vp,color){
    var data=new Float32Array(points.length*3);
    for(var i=0;i<points.length;i++){data[i*3]=points[i][0];data[i*3+1]=points[i][1];data[i*3+2]=points[i][2]}
    gl.useProgram(lineProgram);gl.bindBuffer(gl.ARRAY_BUFFER,lineBuffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(lineLocations.position);gl.vertexAttribPointer(lineLocations.position,3,gl.FLOAT,false,12,0);
    gl.uniformMatrix4fv(lineLocations.mvp,false,mat4Multiply(vp,model));gl.uniform4fv(lineLocations.color,color);
    gl.drawArrays(gl.LINE_STRIP,0,points.length);
  }

  function colonyCells(progress){
    var cells=[],division=Math.min(7,Math.floor(progress*7.05)),count=Math.pow(2,division),radius=.12+Math.pow(count,1/3)*.13,pulse=1+Math.sin(state.time*3.6)*.018;
    for(var i=0;i<count;i++){
      if(count===1){cells.push({x:0,y:0,z:0,r:.88,g:.53,b:.61,size:4.4*pulse});continue}
      var u=rand(i*3+1),polar=rand(i*3+2)*2-1,a=rand(i*3+3)*Math.PI*2,rr=Math.pow(u,1/3)*radius,equator=Math.sqrt(1-polar*polar);
      cells.push({x:Math.cos(a)*equator*rr,y:polar*rr*.72,z:Math.sin(a)*equator*rr,r:.87,g:.50,b:.59,size:2.7*pulse});
    }
    return cells;
  }

  function endodermCells(local){
    var cells=[],count=150;
    for(var i=0;i<count;i++){
      var a=rand(i*5+1)*Math.PI*2,r=Math.sqrt(rand(i*5+2)),clusterX=Math.cos(a)*r*.86,clusterY=Math.sin(a)*r*.63,clusterZ=(rand(i*5+3)-.5)*.5;
      var sheetX=(rand(i*5+4)-.5)*2.7,sheetY=(rand(i*5+5)-.5)*1.35,sheetZ=Math.sin(sheetX*2.5)*.13+(rand(i*7+2)-.5)*.12,t=smooth(local);
      cells.push({x:mix(clusterX,sheetX,t),y:mix(clusterY,sheetY,t),z:mix(clusterZ,sheetZ,t),r:mix(.86,.89,t),g:mix(.48,.52,t),b:mix(.58,.34,t),size:2.25});
    }
    return cells;
  }

  function progenitorCells(local){
    var cells=[],count=230,t=smooth(local);
    for(var i=0;i<count;i++){
      var u=i/(count-1),theta=i*2.39996,y=(u-.5)*2.5,rad=.22+t*.39,sourceX=(rand(i*4+1)-.5)*2.7,sourceY=(rand(i*4+2)-.5)*1.35,sourceZ=(rand(i*4+3)-.5)*.2;
      var targetX=Math.cos(theta)*rad,targetZ=Math.sin(theta)*rad;
      cells.push({x:mix(sourceX,targetX,t),y:mix(sourceY,y,t),z:mix(sourceZ,targetZ,t),r:.91,g:mix(.48,.42,t),b:mix(.36,.41,t),size:2.05});
    }
    return cells;
  }

  function organoidCells(local){
    var cells=[],count=330,t=smooth(local),length=mix(2.4,4.45,t);
    for(var i=0;i<count;i++){
      var u=(i+.5)/count,theta=i*2.39996,v=(i%47)/46,c=curveCenter(v,length),rad=mix(.49,.79,t)+(rand(i*3+4)-.5)*.045;
      cells.push({x:c[0]+Math.cos(theta)*rad,y:c[1],z:c[2]+Math.sin(theta)*rad,r:mix(.91,.76,t),g:mix(.43,.24,t),b:mix(.43,.28,t),size:mix(2.0,1.45,t)});
    }
    return cells;
  }

  function vesselPath(offset,radius){
    var points=[];
    for(var i=0;i<=80;i++){
      var v=i/80,c=curveCenter(v,4.7),angle=offset+v*Math.PI*3.1;
      points.push([c[0]+Math.cos(angle)*radius,c[1],c[2]+Math.sin(angle)*radius]);
    }
    return points;
  }

  function drawGlands(model,vp,alpha){
    var positions=[[-.43,1.48,.22],[-.46,.83,.24],[-.48,.18,.26],[-.46,-.48,.25],[-.43,-1.14,.22]];
    positions.forEach(function(position,index){
      var local=mat4Multiply(mat4Translate(position[0],position[1],position[2]),mat4Scale(.085,.13,.07));
      drawMesh(sphereMesh,mat4Multiply(model,local),vp,[.92,.72,.52,alpha*(index%2?.9:1)]);
    });
  }

  function annotationData(stage,local,representedCells){
    if(stage===0){
      if(representedCells===1)return[
        {text:'خلية iPSC واحدة',p:[0,.36,.2],dx:78,dy:-42},
        {text:'النواة',p:[0,0,.14],dx:-72,dy:8},
        {text:'الغشاء الخلوي',p:[.46,0,0],dx:78,dy:38}
      ];
      return[
        {text:'توسّع نسلي من الخلية الأولى',p:[0,.39,.18],dx:104,dy:-45},
        {text:'خلايا iPSC بنات',p:[-.34,-.03,.12],dx:-93,dy:8},
        {text:'انقسامات متتابعة',p:[.33,-.27,.08],dx:96,dy:35}
      ];
    }
    if(stage===1)return[
      {text:'الأديم الباطن النهائي',p:[-.72,.18,.05],dx:-92,dy:-34},
      {text:'خلايا متمايزة',p:[.55,-.25,.08],dx:92,dy:25},
      {text:'صفيحة خلوية ثلاثية الأبعاد',p:[0,.52,0],dx:80,dy:-54}
    ];
    if(stage===2)return[
      {text:'سلف ظهاري مريئي',p:[.34,.52,.28],dx:92,dy:-38},
      {text:'لمعة مريئية ناشئة',p:[0,0,0],dx:-102,dy:-3},
      {text:'تنظيم أنبوبي للخلايا',p:[-.48,-.58,.12],dx:-92,dy:35}
    ];
    if(stage===3)return[
      {text:'ظهارة مريئية ناشئة',p:[.42,1.0,.24],dx:96,dy:-36},
      {text:'هيكل حيوي داعم',p:[-.66,.18,.2],dx:-96,dy:-14},
      {text:'خلايا عضلية وسدية',p:[.67,-.82,.12],dx:98,dy:26},
      {text:'بداية التروية الدقيقة',p:[-.7,-1.25,0],dx:-94,dy:38}
    ];
    return[
      {text:'الظهارة الحرشفية',p:[.37,1.88,.18],dx:118,dy:-42},
      {text:'الصفيحة الخاصة',p:[.40,1.48,.21],dx:-116,dy:-22},
      {text:'العضلية المخاطية',p:[.42,1.08,.23],dx:116,dy:-12},
      {text:'النسيج تحت المخاطي',p:[.49,.67,.26],dx:-118,dy:-4},
      {text:'الغدد المريئية',p:[-.46,.18,.26],dx:122,dy:2},
      {text:'الأوعية الدموية واللمفية',p:[-.78,-.18,.16],dx:-128,dy:4},
      {text:'ضفيرة ميسنر',p:[.50,-.43,.28],dx:116,dy:8},
      {text:'العضلة الدائرية',p:[.61,-.74,.31],dx:-116,dy:14},
      {text:'ضفيرة أورباخ',p:[.67,-1.04,.33],dx:116,dy:23},
      {text:'العضلة الطولية',p:[.73,-1.38,.35],dx:-116,dy:31},
      {text:'الغلالة الخارجية',p:[.83,-1.75,.37],dx:116,dy:42},
      {text:'اللمعة (التجويف)',p:[0,2.18,.02],dx:-98,dy:-42}
    ];
  }

  function ensureLabelNodes(count){
    while(labelNodes.length<count){
      var line=document.createElement('span'),dot=document.createElement('span'),label=document.createElement('span');
      line.className='youth-3d-label-line';dot.className='youth-3d-label-dot';label.className='youth-3d-label';
      labelLayer.appendChild(line);labelLayer.appendChild(dot);labelLayer.appendChild(label);
      labelNodes.push({line:line,dot:dot,label:label});
    }
    labelNodes.forEach(function(node,index){
      var visible=index<count?'':'none';node.line.style.display=visible;node.dot.style.display=visible;node.label.style.display=visible;
    });
  }

  function updateLabels(items,mvp,width,height){
    ensureLabelNodes(items.length);
    items.forEach(function(item,index){
      var node=labelNodes[index],p=transformPoint(mvp,item.p),ax=(p[0]*.5+.5)*width,ay=(1-(p[1]*.5+.5))*height,lx=clamp(ax+item.dx,55,width-55),ly=clamp(ay+item.dy,36,height-36),dx=lx-ax,dy=ly-ay,distance=Math.sqrt(dx*dx+dy*dy),angle=Math.atan2(dy,dx)*180/Math.PI;
      node.label.textContent=item.text;node.label.style.left=lx+'px';node.label.style.top=ly+'px';
      node.dot.style.left=ax+'px';node.dot.style.top=ay+'px';
      node.line.style.left=ax+'px';node.line.style.top=ay+'px';node.line.style.width=distance+'px';node.line.style.transform='rotate('+angle+'deg)';
    });
  }

  function stageIndex(progress){return Math.min(4,Math.floor(progress+.0001))}
  function updateUI(representedCells){
    var index=stageIndex(state.progress),stage=stages[index],completed=index===4?4:index===3?Math.max(1,Math.round((state.progress-3)*4)):0;
    stageButtons.forEach(function(button,i){button.classList.toggle('active',i===index);button.classList.toggle('complete',i<index)});
    var title=document.getElementById('youthStageLabel'),number=document.getElementById('youthStageNumber'),readout=document.getElementById('youthStageReadout'),meta=document.getElementById('youthCanvasMeta');
    if(title)title.textContent=stage.name;if(number)number.textContent=arNumber(index+1)+' / ٥';if(readout)readout.textContent=stage.short;if(meta)meta.textContent=stage.meta;
    if(cellCount)cellCount.textContent=index===4?'تمثيل مضغوط':arNumber(representedCells);
    if(layerCount)layerCount.textContent=arNumber(completed)+' / ٤';
    document.querySelectorAll('[data-youth-process]').forEach(function(card,i){card.classList.toggle('active-stage',i===index)});
    if(playButton)playButton.textContent=state.playing?'❚❚ إيقاف مؤقت':state.progress>=3.999?'↺ إعادة النمو':'▶ تشغيل النمو';
  }

  function resize(){
    var rect=canvas.getBoundingClientRect();
    if(!rect.width||!rect.height)return false;
    var dpr=Math.min(window.devicePixelRatio||1,2),width=Math.round(rect.width*dpr),height=Math.round(rect.height*dpr);
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height}
    gl.viewport(0,0,width,height);
    return true;
  }

  function render(){
    if(!state.active||!resize())return;
    var width=canvas.clientWidth,height=canvas.clientHeight,progress=clamp(state.progress,0,4),index=stageIndex(progress),local=progress-index;
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.disable(gl.CULL_FACE);
    var scale=index===0?1.62:index===1?1.48:index===2?1.3:index===3?1.02:.94;
    var model=modelMatrix(scale),vp=viewProjection(width,height),mvp=mat4Multiply(vp,model),labelMvp=mvp,cells=[];

    if(index===0){
      cells=colonyCells(local);
      if(cells.length===1){
        var cellModel=mat4Multiply(model,mat4Scale(.62,.62,.62));
        drawMesh(sphereMesh,cellModel,vp,[.92,.54,.63,.50]);
        var nucleusModel=mat4Multiply(model,mat4Scale(.29,.29,.29));
        drawMesh(sphereMesh,nucleusModel,vp,[.43,.14,.31,1]);
      }else drawCells(cells,model,vp,width,height);
    }else if(index===1){
      cells=endodermCells(local);drawCells(cells,model,vp,width,height);
    }else if(index===2){
      cells=progenitorCells(local);drawCells(cells,model,vp,width,height);
      if(local>.55)drawMesh(layerMeshes[0].mesh,mat4Multiply(model,mat4Scale(.72,.42,.72)),vp,[.88,.36,.39,(local-.55)*.42]);
    }else if(index===3){
      cells=organoidCells(local);drawCells(cells,model,vp,width,height);
      var lengthScale=.48+.52*smooth(local),layersVisible=1+Math.floor(local*(layerMeshes.length-.01));
      labelMvp=mat4Multiply(vp,mat4Multiply(model,mat4Scale(1,lengthScale,1)));
      for(var l=0;l<layersVisible;l++){
        var layer=layerMeshes[l],alpha=l===layersVisible-1&&local<.98?.72:1;
        drawMesh(layer.mesh,mat4Multiply(model,mat4Scale(1,lengthScale,1)),vp,[layer.color[0],layer.color[1],layer.color[2],alpha]);
      }
      if(local>.45){drawLine(vesselPath(.9,.88),mat4Multiply(model,mat4Scale(1,lengthScale,1)),vp,[.72,.12,.17,.9]);drawLine(vesselPath(3.6,.87),mat4Multiply(model,mat4Scale(1,lengthScale,1)),vp,[.28,.55,.58,.8])}
      if(local>.68){drawGlands(mat4Multiply(model,mat4Scale(1,lengthScale,1)),vp,Math.min(1,(local-.68)*3.2));drawLine(vesselPath(5.0,.50),mat4Multiply(model,mat4Scale(1,lengthScale,1)),vp,[.96,.74,.28,.72]);drawLine(vesselPath(2.4,.665),mat4Multiply(model,mat4Scale(1,lengthScale,1)),vp,[.96,.61,.19,.72])}
    }else{
      for(var m=0;m<layerMeshes.length;m++){var completeLayer=layerMeshes[m];drawMesh(completeLayer.mesh,model,vp,completeLayer.color)}
      drawGlands(model,vp,1);
      drawLine(vesselPath(.9,.88),model,vp,[.74,.10,.15,.95]);drawLine(vesselPath(3.6,.87),model,vp,[.25,.58,.61,.9]);
      drawLine(vesselPath(5.0,.50),model,vp,[.96,.74,.28,.78]);drawLine(vesselPath(2.4,.665),model,vp,[.96,.61,.19,.82]);
    }

    updateLabels(annotationData(index,local,cells.length||1),labelMvp,width,height);
    updateUI(cells.length||1);
  }

  function setProgress(value,fromSlider){
    state.progress=clamp(Number(value)||0,0,4);
    if(!fromSlider)slider.value=state.progress.toFixed(2);
    render();
  }
  function setActive(active){
    state.active=!!active;
    if(!state.active)state.playing=false;
    wrap.classList.toggle('real-3d',state.active);
    [stageRail,counts,tissueKey,playButton,labelLayer].forEach(function(element){if(element)element.style.display=state.active?'':'none'});
    if(state.active)render();
  }
  function rotate(delta){state.yaw+=delta;render()}

  canvas.addEventListener('pointerdown',function(event){state.dragging=true;state.x=event.clientX;state.y=event.clientY;canvas.setPointerCapture(event.pointerId)});
  canvas.addEventListener('pointermove',function(event){
    if(!state.dragging)return;
    state.yaw+=(event.clientX-state.x)*.011;state.pitch=clamp(state.pitch+(event.clientY-state.y)*.009,-.72,.72);state.x=event.clientX;state.y=event.clientY;render();
  });
  canvas.addEventListener('pointerup',function(){state.dragging=false});
  canvas.addEventListener('pointercancel',function(){state.dragging=false});
  canvas.addEventListener('wheel',function(event){event.preventDefault();state.zoom=clamp(state.zoom-event.deltaY*.0008,.72,1.5);render()},{passive:false});
  slider.addEventListener('input',function(){if(state.active)setProgress(slider.value,true)});
  stageButtons.forEach(function(button){button.addEventListener('click',function(){state.playing=false;setProgress(Number(button.getAttribute('data-youth-3d-stage')),false);if(window.syncYouthStage)window.syncYouthStage(state.progress)})});
  if(playButton)playButton.addEventListener('click',function(){
    if(state.progress>=3.999&&!state.playing){setProgress(0,false);if(window.syncYouthStage)window.syncYouthStage(0)}
    state.playing=!state.playing;updateUI(1);
  });

  window.youth3D={setActive:setActive,setProgress:setProgress,rotate:rotate,render:render,resize:resize,isReal3D:true};
  var selected=document.querySelector('[data-youth-organ].active');
  setActive(!selected||selected.dataset.youthOrgan==='esophagus');

  function loop(now){
    var delta=Math.min(80,now-state.lastFrame);state.lastFrame=now;state.time=now*.001;
    if(state.playing&&state.active){
      state.progress=Math.min(4,state.progress+delta/6100);
      slider.value=state.progress.toFixed(2);
      if(window.syncYouthStage)window.syncYouthStage(state.progress);
      if(state.progress>=4)state.playing=false;
      render();
    }else if(state.active&&stageIndex(state.progress)===0)render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
