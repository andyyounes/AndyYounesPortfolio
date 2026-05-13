/* BgCanvas.jsx — cursor-reactive shader-feeling background
   Uses canvas 2d with radial gradients (cheaper than WebGL for this look,
   and lets us paint subtle iridescent blobs that follow the cursor).
*/

function BgCanvas() {
  const ref = React.useRef(null);
  const stateRef = React.useRef({
    mx: 0.5, my: 0.5,
    sx: 0.5, sy: 0.5,
    t: 0,
  });

  React.useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      stateRef.current.mx = e.clientX / window.innerWidth;
      stateRef.current.my = e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMove);

    let raf;
    const tick = () => {
      const s = stateRef.current;
      // ease
      s.sx += (s.mx - s.sx) * 0.04;
      s.sy += (s.my - s.sy) * 0.04;
      s.t += 0.005;

      ctx.clearRect(0, 0, w, h);

      // Three iridescent blobs
      const blob = (cx, cy, r, color) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, color + '55');
        g.addColorStop(0.4, color + '22');
        g.addColorStop(1, color + '00');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      };

      const cx = s.sx * w;
      const cy = s.sy * h;
      const wob = Math.sin(s.t) * 80;
      const wob2 = Math.cos(s.t * 0.7) * 60;

      // violet near cursor
      blob(cx, cy, 520, '#7c5cff');
      // cyan offset
      blob(w * 0.2 + wob, h * 0.3 + wob2, 460, '#3ed4ff');
      // magenta far corner
      blob(w * 0.85 + wob2, h * 0.75 + wob, 500, '#ff7ac0');

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} className="bg-canvas" />;
}

window.BgCanvas = BgCanvas;
