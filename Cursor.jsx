/* Cursor.jsx — custom cursor + light source */

function Cursor() {
  const ringRef = React.useRef(null);
  const dotRef = React.useRef(null);

  React.useEffect(() => {
    let rx = window.innerWidth / 2, ry = window.innerHeight / 2;
    let mx = rx, my = ry;
    let dx = mx, dy = my;
    let lx = 0.5, ly = 0.5;
    let slx = lx, sly = ly;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      lx = e.clientX / window.innerWidth;
      ly = e.clientY / window.innerHeight;
    };
    const onOver = (e) => {
      const t = e.target;
      const interactive = t.closest && t.closest('a, button, .project, .skill, .card-wrap, .nav-mark');
      if (interactive) ringRef.current && ringRef.current.classList.add('hover');
      else ringRef.current && ringRef.current.classList.remove('hover');
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);

    let raf;
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dx += (mx - dx) * 0.5;
      dy += (my - dy) * 0.5;
      slx += (lx - slx) * 0.06;
      sly += (ly - sly) * 0.06;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      if (dotRef.current) dotRef.current.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      document.documentElement.style.setProperty('--lx', (slx*100).toFixed(2) + '%');
      document.documentElement.style.setProperty('--ly', (sly*100).toFixed(2) + '%');
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

/* Static iridescent background — single canvas paint, only updates on resize */
function BgCanvas() {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const canvas = ref.current;
    const c = canvas.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const paint = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, w, h);

      const blob = (cx, cy, r, color, a) => {
        const g = c.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, color + Math.floor(a*255).toString(16).padStart(2,'0'));
        g.addColorStop(0.5, color + '11');
        g.addColorStop(1, color + '00');
        c.fillStyle = g;
        c.fillRect(0, 0, w, h);
      };

      blob(w * 0.25, h * 0.3, 600, '#7c5cff', 0.22);
      blob(w * 0.85, h * 0.7, 560, '#ff7ac0', 0.16);
      blob(w * 0.55, h * 0.5, 700, '#3ed4ff', 0.10);
    };

    paint();
    window.addEventListener('resize', paint);
    return () => window.removeEventListener('resize', paint);
  }, []);

  return <canvas ref={ref} className="bg-canvas"/>;
}

window.Cursor = Cursor;
window.BgCanvas = BgCanvas;
