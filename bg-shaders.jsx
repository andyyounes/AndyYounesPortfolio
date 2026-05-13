// bg-shaders.jsx — Five interactive WebGL shader wallpapers

const VERT_SRC = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

/* ── 1. Liquid Chrome ─────────────────────────────────────────────────────
   Domain-warped fbm noise → swirling metallic surface.
   Mouse gently perturbs the warp field. */
const FRAG_CHROME = `
precision highp float;
uniform float u_time;
uniform vec2  u_mouse;
uniform vec2  u_res;

float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){
  vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);
}
float fbm(vec2 p){
  float v=0.0,a=0.5;
  for(int i=0;i<6;i++){v+=a*n(p);p=p*2.0+vec2(1.7,9.2);a*=0.5;}
  return v;
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  vec2 mouse=u_mouse/u_res;
  float t=u_time*0.09;

  vec2 q=vec2(fbm(uv*2.0+t),fbm(uv*2.0+t+vec2(1.7,9.2)));
  vec2 r=vec2(fbm(uv*3.0+1.5*q+vec2(1.7,9.2)+0.15*t),
              fbm(uv*3.0+1.5*q+vec2(8.3,2.8)+0.126*t));
  r+=(1.0-smoothstep(0.0,0.5,length(uv-mouse)))*0.18;
  float f=fbm(uv+r);

  vec3 col=mix(vec3(0.022,0.022,0.032),vec3(0.62,0.66,0.74),smoothstep(0.18,0.72,f));
  col=mix(col,vec3(0.88,0.90,0.95),smoothstep(0.72,0.94,f));
  float spec=pow(max(0.0,f-0.70),2.2)*1.20;
  col+=vec3(spec*0.90,spec*0.93,spec);
  col+=vec3(0.06,0.038,0.008)*(1.0-smoothstep(0.18,0.50,f));
  vec2 vig=uv*(1.0-uv.yx);
  col*=pow(clamp(vig.x*vig.y*18.0,0.0,1.0),0.14);
  gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);
}
`;

/* ── 2. Aurora Chrome ─────────────────────────────────────────────────────
   Flowing liquid mercury — fbm warp + caustic surface.
   High-contrast: deep black channels, bright silver crests.
   Mouse ripples the surface. */
const FRAG_AURORA = `
precision highp float;
uniform float u_time;
uniform vec2  u_mouse;
uniform vec2  u_res;

float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){
  vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);
}
float fbm(vec2 p){
  float v=0.0,a=0.5;
  for(int i=0;i<5;i++){v+=a*n(p);p=p*2.1+vec2(3.1,1.7);a*=0.52;}
  return v;
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  uv.x*=u_res.x/u_res.y;
  vec2 mouse=u_mouse/u_res;
  mouse.x*=u_res.x/u_res.y;
  float t=u_time*0.16;

  // Two-layer fluid warp
  vec2 q=vec2(fbm(uv+t*0.55), fbm(uv+vec2(3.2,1.8)+t*0.50));
  vec2 r=vec2(fbm(uv+1.9*q+vec2(1.7,9.2)+t*0.42),
              fbm(uv+1.9*q+vec2(8.3,2.8)+t*0.38));

  // Mouse ripples surface
  float md=length(uv-mouse);
  r+=(1.0-smoothstep(0.0,0.55,md))*0.38;

  float f=fbm(uv+r);

  // Caustic: two sine planes multiplied → sharp bright channels like water
  float ca=sin(f*16.0+t*1.8)*0.5+0.5;
  float cb=sin(f*11.0+t*2.1+1.57)*0.5+0.5;
  float caustic=ca*cb;

  // Blend fbm base with caustic highlight — controls how "watery" vs "smoky"
  float surf=mix(f, caustic, 0.45);

  // High-contrast chrome: black → steel → silver → white
  vec3 col=vec3(0.008,0.008,0.012);
  col=mix(col, vec3(0.06,0.07,0.10),  smoothstep(0.12,0.36,surf));
  col=mix(col, vec3(0.36,0.40,0.50),  smoothstep(0.36,0.58,surf));
  col=mix(col, vec3(0.68,0.72,0.82),  smoothstep(0.58,0.76,surf));
  col=mix(col, vec3(0.90,0.92,0.96),  smoothstep(0.76,0.90,surf));
  col=mix(col, vec3(1.00,1.00,1.00),  smoothstep(0.90,1.00,surf));

  // Warm gold in deepest shadows (like the reference image)
  col+=vec3(0.08,0.05,0.01)*(1.0-smoothstep(0.0,0.28,f))*0.65;

  gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);
}
`;

/* ── 3. Neural Lattice ────────────────────────────────────────────────────
   Grid of animated nodes connected by pulsing energy lines.
   Mouse creates a local glow. */
const FRAG_NEURAL = `
precision highp float;
uniform float u_time;
uniform vec2  u_mouse;
uniform vec2  u_res;

float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}

void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  vec2 mouse=u_mouse/u_res;
  float t=u_time*0.52;
  const float G=9.0;
  vec2 cell=floor(uv*G);
  float glow=0.0, lines=0.0;

  for(int dx=-1;dx<=1;dx++){
    for(int dy=-1;dy<=1;dy++){
      vec2 c=cell+vec2(float(dx),float(dy));
      vec2 off=vec2(h(c)-0.5,h(c+vec2(19.1,47.3))-0.5)*0.44;
      vec2 nPos=(c+0.5+off+sin(t*1.25+h(c)*6.283)*0.065)/G;
      float pd=length(uv-nPos)*u_res.x;
      glow+=exp(-pd*pd*0.055)*(0.5+0.5*sin(t*2.2+h(c)*6.283));

      if(dx!=0||dy!=0){
        vec2 c0=cell;
        vec2 off0=vec2(h(c0)-0.5,h(c0+vec2(19.1,47.3))-0.5)*0.44;
        vec2 a=(c0+0.5+off0+sin(t*1.25+h(c0)*6.283)*0.065)/G;
        vec2 ab=nPos-a; float len=length(ab);
        if(len>0.001){
          float proj=clamp(dot(uv-a,ab/len),0.0,len);
          float ld=length(uv-a-(ab/len)*proj)*u_res.x;
          float energy=sin(proj*G*28.0-t*3.6+h(c)*3.14)*0.5+0.5;
          lines+=exp(-ld*ld*0.5)*energy*0.38;
        }
      }
    }
  }
  float mg=(1.0-smoothstep(0.0,0.18,length(uv-mouse)))*0.28;
  vec3 col=vec3(0.010,0.010,0.018);
  col+=vec3(0.16,0.40,0.90)*clamp(glow,0.0,2.0)*0.22;
  col+=vec3(0.10,0.26,0.68)*min(lines,1.5)*0.55;
  col+=vec3(0.32,0.50,0.92)*mg;
  gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);
}
`;

/* ── 4. Plasma Void ───────────────────────────────────────────────────────
   Sine interference field. Mouse creates a persistent ripple.
   Click anywhere to spawn expanding wave rings. */
const FRAG_PLASMA = `
precision highp float;
uniform float u_time;
uniform vec2  u_mouse;
uniform vec2  u_res;
uniform vec3  u_clicks[8];

void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  vec2 mouse=u_mouse/u_res;
  float t=u_time;
  float p=sin(uv.x*7.2+t*0.70)*0.5
         +sin(uv.y*5.6+t*0.56)*0.5
         +sin((uv.x+uv.y)*4.8+t*0.94)*0.5
         +sin(length(uv-vec2(0.5))*11.5-t*1.12)*0.5;
  float md=length(uv-mouse);
  p+=sin(md*22.0-t*3.5)*exp(-md*2.4)*0.72;
  for(int i=0;i<8;i++){
    float age=t-u_clicks[i].z;
    if(age>0.0&&age<4.5){
      float d=length(uv-u_clicks[i].xy/u_res);
      p+=sin(d*26.0-age*9.5)*exp(-d*3.5)*exp(-age*1.2)*1.1;
    }
  }
  p=p*0.108+0.5;
  vec3 col=vec3(0.0);
  col+=vec3(0.0,0.022,0.09)*smoothstep(0.16,0.52,p);
  col+=vec3(0.10,0.24,0.56)*smoothstep(0.52,0.80,p);
  col+=vec3(0.48,0.64,0.92)*smoothstep(0.80,0.94,p);
  col+=vec3(0.88,0.92,1.00)*smoothstep(0.94,1.00,p);
  gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);
}
`;

/* ── 5. Chrome Silk ───────────────────────────────────────────────────────
   Noise-driven anisotropic fibers. Mouse position controls a specular
   highlight that slides along the fiber direction — like holding a lamp
   over dark silk. */
const FRAG_SILK = `
precision highp float;
uniform float u_time;
uniform vec2  u_mouse;
uniform vec2  u_res;

float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){
  vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  vec2 mouse=u_mouse/u_res;
  float t=u_time*0.065;
  float asp=u_res.x/u_res.y;
  float angle=n(uv*2.4+t*0.38)*6.2832+uv.x*1.15+uv.y*0.75;
  vec2 dir=vec2(cos(angle),sin(angle));
  vec2 toM=mouse-uv;
  float perp=dot(toM,vec2(-dir.y,dir.x))*asp;
  float para=dot(toM,dir);
  float spec=exp(-(perp*perp*0.10+para*para*0.88)*26.0);
  float fab=n(uv*15.0+dir*0.28)*0.5+n(uv*30.0)*0.30+n(uv*60.0)*0.14;
  vec3 col=mix(vec3(0.020,0.020,0.032),vec3(0.085,0.095,0.12),fab);
  col+=vec3(0.60,0.68,0.84)*spec*1.95;
  col+=vec3(0.22,0.28,0.42)*spec*spec*2.4;
  col+=vec3(0.11,0.13,0.18)*n(uv*19.0+t)*n(uv*10.0-t*0.75)*fab*0.80;
  col+=(1.0-smoothstep(0.0,0.10,length(uv-mouse)))*vec3(0.09,0.11,0.17)*0.5;
  gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);
}
`;

/* ── Registry ─────────────────────────────────────────────────────────── */
window.BG_SHADERS = [
  { name: 'Aurora Chrome', frag: FRAG_AURORA  },
  { name: 'Liquid Chrome', frag: FRAG_CHROME  },
  { name: 'Neural Lattice',frag: FRAG_NEURAL  },
  { name: 'Plasma Void',   frag: FRAG_PLASMA  },
  { name: 'Chrome Silk',   frag: FRAG_SILK    },
];

/* ── ShaderCanvas component ───────────────────────────────────────────── */
function ShaderCanvas({ shaderIdx }) {
  const canvasRef  = React.useRef(null);
  const idxRef     = React.useRef(shaderIdx);
  const t0Ref      = React.useRef(performance.now() / 1000);

  // Click ring buffer: 8 × [x, y, time], initialised far in the past
  const _initClicks = new Float32Array(24);
  for (let _i = 0; _i < 8; _i++) _initClicks[_i * 3 + 2] = -100;
  const clicksRef  = React.useRef(_initClicks);
  const clickiRef  = React.useRef(0);

  React.useEffect(() => { idxRef.current = shaderIdx; }, [shaderIdx]);

  // Click / tap tracking
  React.useEffect(() => {
    const push = (x, y) => {
      const i = clickiRef.current * 3;
      clicksRef.current[i]     = x;
      clicksRef.current[i + 1] = window.innerHeight - y;
      clicksRef.current[i + 2] = performance.now() / 1000 - t0Ref.current;
      clickiRef.current = (clickiRef.current + 1) % 8;
    };
    const onMouse = e => push(e.clientX, e.clientY);
    const onTouch = e => { const t = e.changedTouches[0]; push(t.clientX, t.clientY); };
    window.addEventListener('click',    onMouse);
    window.addEventListener('touchend', onTouch, { passive: true });
    return () => {
      window.removeEventListener('click',    onMouse);
      window.removeEventListener('touchend', onTouch);
    };
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', {
      alpha: false, antialias: false, powerPreference: 'high-performance',
    });
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let mx = window.innerWidth * 0.5;
    let my = window.innerHeight * 0.5;

    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove  = e => { mx = e.clientX; my = e.clientY; };
    const onTouch = e => { mx = e.touches[0].clientX; my = e.touches[0].clientY; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onTouch, { passive: true });

    // Full-screen quad
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const mkShader = (src, type) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('[bg-shader] compile:', gl.getShaderInfoLog(s));
        gl.deleteShader(s); return null;
      }
      return s;
    };

    let prog = null, locs = {}, currentIdx = -1;

    const buildProg = (fragSrc) => {
      if (prog) { gl.deleteProgram(prog); prog = null; }
      const vs = mkShader(VERT_SRC, gl.VERTEX_SHADER);
      const fs = mkShader(fragSrc,  gl.FRAGMENT_SHADER);
      if (!vs || !fs) return;
      const p = gl.createProgram();
      gl.attachShader(p, vs); gl.attachShader(p, fs);
      gl.linkProgram(p);
      gl.deleteShader(vs); gl.deleteShader(fs);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.error('[bg-shader] link:', gl.getProgramInfoLog(p));
        return;
      }
      prog = p;
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      const aPos = gl.getAttribLocation(prog, 'a_pos');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      locs = {
        time:   gl.getUniformLocation(prog, 'u_time'),
        mouse:  gl.getUniformLocation(prog, 'u_mouse'),
        res:    gl.getUniformLocation(prog, 'u_res'),
        clicks: gl.getUniformLocation(prog, 'u_clicks[0]'),
      };
    };

    let raf;
    const t0 = t0Ref.current;

    const tick = () => {
      if (idxRef.current !== currentIdx) {
        currentIdx = idxRef.current;
        buildProg((window.BG_SHADERS[currentIdx] || window.BG_SHADERS[0]).frag);
      }
      if (prog) {
        const t = performance.now() / 1000 - t0;
        const h = canvas.height / dpr;
        gl.uniform1f(locs.time,  t);
        gl.uniform2f(locs.mouse, mx, h - my);
        gl.uniform2f(locs.res,   canvas.width / dpr, h);
        if (locs.clicks) gl.uniform3fv(locs.clicks, clicksRef.current);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize',    resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
      if (prog) gl.deleteProgram(prog);
      gl.deleteBuffer(quad);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', inset: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0,
    }}/>
  );
}

window.ShaderCanvas = ShaderCanvas;
