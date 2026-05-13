/* Artifact.jsx — the universal interactive artifact wrapper.
   - Position in 3D space (x, y, z)
   - Parallax against cursor & camera (scroll)
   - Breathing/floating motion via per-instance phase
   - Cursor-driven specular (sets --mx, --my on its element)
   - Click handler for expansion */

function Artifact({
  x = 0, y = 0, z = 0,
  parallax = 1,        // multiplier on cursor parallax
  float = 1,           // multiplier on breathing
  phase = 0,           // unique offset
  rotate = 0,
  tilt = true,         // 3D tilt on hover
  className = '',
  children,
  onClick,
  style: extraStyle,
}) {
  const ref = React.useRef(null);
  const ctx = React.useContext(SpatialContext);
  const [hovered, setHovered] = React.useState(false);
  const hoverRef = React.useRef(false);
  const localRef = React.useRef({ tx: 0, ty: 0, sx: 0, sy: 0 });

  React.useEffect(() => {
    if (!ctx) return;
    const el = ref.current;
    if (!el) return;

    return ctx.subscribe((s) => {
      // Parallax: cursor offset from center — minimal & only on Y
      // Removed horizontal drift entirely. Vertical micro-parallax only.
      const py = (s.sy - 0.5) * 12 * parallax;

      // No idle breathing — calm at rest

      // Smooth local pointer (for specular)
      const l = localRef.current;
      l.sx += (l.tx - l.sx) * 0.12;
      l.sy += (l.ty - l.sy) * 0.12;

      // Hover tilt — reduced intensity (~70% off): max 5deg
      let rx = 0, ry = 0, lift = 0;
      if (hoverRef.current && tilt) {
        rx = -(l.sy - 0.5) * 5;
        ry =  (l.sx - 0.5) * 5;
        lift = 4;
      }

      // Camera (scroll) translation: 1:1 base, with parallax adding subtle delta
      const camOffset = -s.cam + (s.cam * (parallax - 1) * 0.04);

      el.style.transform = `
        translate3d(${x}px, calc(${y}px + ${camOffset}px + ${py}px), ${z + lift}px)
        rotateZ(${rotate}deg)
        rotateX(${rx}deg)
        rotateY(${ry}deg)
      `;

      // depth dimming based on z only (so off-screen artifacts don't fade)
      const depthOpacity = Math.max(0.4, Math.min(1, 1 - Math.abs(z) / 1800));
      el.style.opacity = depthOpacity;

      // specular
      el.style.setProperty('--mx', (l.sx * 100).toFixed(2) + '%');
      el.style.setProperty('--my', (l.sy * 100).toFixed(2) + '%');
    });
  }, [ctx, x, y, z, parallax, float, phase, rotate, tilt]);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    localRef.current.tx = (e.clientX - r.left) / r.width;
    localRef.current.ty = (e.clientY - r.top) / r.height;
  };
  const onEnter = () => { hoverRef.current = true; setHovered(true); };
  const onLeave = () => {
    hoverRef.current = false; setHovered(false);
    localRef.current.tx = 0.5; localRef.current.ty = 0.5;
  };

  return (
    <div
      ref={ref}
      className={`artifact ${className}`}
      style={extraStyle}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      data-hovered={hovered ? '1' : '0'}
    >
      {children}
    </div>
  );
}

window.Artifact = Artifact;
