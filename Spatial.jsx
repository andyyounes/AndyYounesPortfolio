/* Spatial.jsx — the field of artifacts engine
   Shared globals for cursor + camera + time, used by every artifact. */

const SpatialContext = React.createContext(null);

function SpatialProvider({ children }) {
  const stateRef = React.useRef({
    // raw
    mx: 0.5, my: 0.5,
    sx: 0.5, sy: 0.5, // smoothed
    cam: 0,           // smoothed scroll position (px)
    camTarget: 0,
    t: 0,
  });
  const [, force] = React.useState(0);
  const subsRef = React.useRef(new Set());

  const subscribe = React.useCallback((fn) => {
    subsRef.current.add(fn);
    return () => subsRef.current.delete(fn);
  }, []);

  React.useEffect(() => {
    const onMove = (e) => {
      stateRef.current.mx = e.clientX / window.innerWidth;
      stateRef.current.my = e.clientY / window.innerHeight;
    };
    const onScroll = () => {
      stateRef.current.camTarget = window.scrollY;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll, { passive: true });

    let raf;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = stateRef.current;
      // smooth
      s.sx += (s.mx - s.sx) * 0.08;
      s.sy += (s.my - s.sy) * 0.08;
      s.cam += (s.camTarget - s.cam) * 0.1;
      s.t += dt;

      // expose to CSS
      const root = document.documentElement;
      root.style.setProperty('--lx', (s.sx * 100).toFixed(2) + '%');
      root.style.setProperty('--ly', (s.sy * 100).toFixed(2) + '%');
      root.style.setProperty('--lpx', s.sx.toFixed(3));
      root.style.setProperty('--lpy', s.sy.toFixed(3));
      root.style.setProperty('--cam', s.cam.toFixed(2));
      root.style.setProperty('--t', s.t.toFixed(2));

      // notify subscribers
      subsRef.current.forEach(fn => fn(s));

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <SpatialContext.Provider value={{ stateRef, subscribe }}>
      {children}
    </SpatialContext.Provider>
  );
}

function useSpatial(updateFn) {
  const ctx = React.useContext(SpatialContext);
  React.useEffect(() => {
    if (!ctx || !updateFn) return;
    return ctx.subscribe(updateFn);
  }, [ctx, updateFn]);
  return ctx;
}

/* ===== Custom cursor ===== */
function Cursor() {
  const ringRef = React.useRef(null);
  const dotRef = React.useRef(null);

  React.useEffect(() => {
    let rx = window.innerWidth / 2, ry = window.innerHeight / 2;
    let mx = rx, my = ry;
    let dx = mx, dy = my;

    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    const onOver = (e) => {
      const t = e.target;
      if (t.closest && t.closest('.artifact, .hud-link, .depth-tick, .expand-close, .frag, .chip-art, a, button')) {
        ringRef.current && ringRef.current.classList.add('hover');
      } else {
        ringRef.current && ringRef.current.classList.remove('hover');
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);

    let raf;
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dx += (mx - dx) * 0.5;
      dy += (my - dy) * 0.5;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      if (dotRef.current) dotRef.current.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor"/>
      <div ref={dotRef} className="cursor-dot"/>
    </>
  );
}

/* ===== Background ===== */
function BgCanvas() {
  const ref = React.useRef(null);
  const ctx = React.useContext(SpatialContext);

  React.useEffect(() => {
    const canvas = ref.current;
    const c = canvas.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    let raf;
    const tick = () => {
      const s = ctx.stateRef.current;
      c.clearRect(0, 0, w, h);
      const blob = (cx, cy, r, color, a) => {
        const g = c.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, color + Math.floor(a*255).toString(16).padStart(2,'0'));
        g.addColorStop(0.5, color + '11');
        g.addColorStop(1, color + '00');
        c.fillStyle = g;
        c.fillRect(0, 0, w, h);
      };
      const cx = s.sx * w, cy = s.sy * h;
      // Static background blobs — only the cursor-tracked one moves
      blob(cx, cy, 700, '#7c5cff', 0.28);
      blob(w * 0.18, h * 0.28, 520, '#3ed4ff', 0.18);
      blob(w * 0.85, h * 0.78, 560, '#ff7ac0', 0.16);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, [ctx]);

  return <canvas ref={ref} className="bg-canvas"/>;
}

window.SpatialProvider = SpatialProvider;
window.SpatialContext = SpatialContext;
window.useSpatial = useSpatial;
window.Cursor = Cursor;
window.BgCanvas = BgCanvas;
