// Pendulum.jsx — precision timing element
// Reacts to: scroll velocity, cursor proximity, section transitions.
// Zero-crossing "tick" brightens the scale marks on each swing through center.

const Pendulum = () => {
  const armRef      = React.useRef(null);
  const wrapRef     = React.useRef(null);
  const scaleRef    = React.useRef(null); // tick marks group
  const bobRimRef   = React.useRef(null); // iridescent rim on bob

  React.useEffect(() => {
    let target   = 0;
    let current  = 0;
    let velocity = 0;
    let lastScrollY = window.scrollY;

    // Zero-crossing state for tick flash
    let lastAngle   = 0;
    let tickFlash   = 0;     // frames remaining for flash
    let crossLocked = false; // debounce double-trigger

    // Cursor proximity for bob rim glow
    let proximityRatio = 0; // 0 = far, 1 = near

    const onScroll = () => {
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      // Slightly stronger scroll nudge for more timing-element feel
      velocity += dy * 0.0009;
      velocity  = Math.max(-0.032, Math.min(0.032, velocity));
    };

    const onMove = (e) => {
      const w = wrapRef.current;
      if (!w) return;
      const r   = w.getBoundingClientRect();
      const cx  = r.left + r.width  / 2;
      const cy  = r.top  + r.height / 2;
      const dx  = e.clientX - cx;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

      if (dist < 320) {
        target = Math.max(-1, Math.min(1, dx / 320)) * 0.22;
        proximityRatio = Math.max(0, 1 - dist / 320);
      } else {
        target = 0;
        proximityRatio = 0;
      }
    };

    // Section transition nudge — gives the pendulum a meaningful kick
    // when the user moves to a new section, reinforcing the timing feel
    const onSectionChange = (e) => {
      const nudge = (Math.random() > 0.5 ? 1 : -1) * 0.022;
      velocity += nudge;
    };

    let raf;
    const tick = () => {
      // Spring physics — deliberately slow and precise
      const spring  = 0.012;
      const damping = 0.985;
      velocity += (target - current) * spring;
      velocity *= damping;
      current  += velocity;

      const angle = current * 14; // max ~14 degrees

      if (armRef.current) {
        armRef.current.setAttribute('transform', `rotate(${angle.toFixed(3)} 30 8)`);
      }

      // Zero-crossing tick: flash scale marks when pendulum passes center
      // Only triggers when swinging with enough speed to be meaningful
      if (Math.abs(velocity) > 0.003) {
        const crossed = lastAngle * angle <= 0;
        if (crossed && !crossLocked) {
          crossLocked = true;
          tickFlash   = 10; // ~166ms at 60fps
        } else if (!crossed) {
          crossLocked = false;
        }
      }

      if (scaleRef.current) {
        if (tickFlash > 0) {
          const t = tickFlash / 10;
          scaleRef.current.style.opacity = (0.35 + t * 0.55).toFixed(2);
          tickFlash--;
        } else {
          scaleRef.current.style.opacity = '0.38';
        }
      }

      // Bob iridescent rim — brightens with cursor proximity or swing speed
      if (bobRimRef.current) {
        const swingIntensity = Math.min(1, Math.abs(velocity) / 0.025);
        const rimOpacity = 0.22 + proximityRatio * 0.5 + swingIntensity * 0.28;
        bobRimRef.current.setAttribute('opacity', rimOpacity.toFixed(3));
      }

      lastAngle = angle;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('scroll',        onScroll,        { passive: true });
    window.addEventListener('mousemove',     onMove);
    window.addEventListener('sectionchange', onSectionChange);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll',        onScroll);
      window.removeEventListener('mousemove',     onMove);
      window.removeEventListener('sectionchange', onSectionChange);
    };
  }, []);

  return (
    <div className="pendulum-wrap" ref={wrapRef}>
      <svg viewBox="0 0 60 220" width="100%" height="100%">
        <defs>
          <linearGradient id="pdRod" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#1a1a22"/>
            <stop offset="50%"  stopColor="#7a7a87"/>
            <stop offset="100%" stopColor="#1a1a22"/>
          </linearGradient>
          <radialGradient id="pdBob" cx="0.35" cy="0.3" r="0.7">
            <stop offset="0%"   stopColor="#9a9aa8"/>
            <stop offset="40%"  stopColor="#36363e"/>
            <stop offset="100%" stopColor="#0c0c12"/>
          </radialGradient>
          <linearGradient id="pdMount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3a3a44"/>
            <stop offset="100%" stopColor="#0a0a0e"/>
          </linearGradient>
          {/* Light-reactive iridescent rim gradient */}
          <linearGradient id="pdBobRim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#a98bff" stopOpacity="0.9"/>
            <stop offset="50%"  stopColor="#6dd3ff" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#f4c780" stopOpacity="0.8"/>
          </linearGradient>
        </defs>

        {/* Mount bracket */}
        <rect x="20" y="0"  width="20" height="10" fill="url(#pdMount)" stroke="#0a0a0e" strokeWidth="0.5"/>
        <line x1="20" y1="2"  x2="40"  y2="2"  stroke="#7a7a87" strokeWidth="0.4" opacity="0.6"/>
        <circle cx="30" cy="8" r="1.8" fill="#0a0a0e" stroke="#54545f" strokeWidth="0.4"/>

        {/* Swinging arm */}
        <g ref={armRef} style={{ transformOrigin: '30px 8px' }}>
          {/* Rod */}
          <rect x="29.4" y="8" width="1.2" height="160" fill="url(#pdRod)"/>
          {/* Rod tick marks */}
          <line x1="28" y1="50"  x2="32" y2="50"  stroke="#36363e" strokeWidth="0.4"/>
          <line x1="28" y1="100" x2="32" y2="100" stroke="#36363e" strokeWidth="0.4"/>
          <line x1="28" y1="150" x2="32" y2="150" stroke="#36363e" strokeWidth="0.4"/>
          {/* Bob */}
          <circle cx="30" cy="178" r="11" fill="url(#pdBob)" stroke="#0a0a0e" strokeWidth="0.6"/>
          {/* Light-reactive iridescent rim — opacity set by JS */}
          <circle ref={bobRimRef} cx="30" cy="178" r="11"
            fill="none" stroke="url(#pdBobRim)" strokeWidth="1.2" opacity="0.22"/>
          {/* Specular highlight */}
          <ellipse cx="27" cy="174" rx="2.4" ry="3" fill="#cfcfd9" opacity="0.4"/>
          {/* Bob center */}
          <circle cx="30" cy="178" r="0.8" fill="#1d1d24"/>
        </g>

        {/* Scale tick marks on side — brightness driven by zero-crossing JS */}
        <g ref={scaleRef} style={{ transition: 'opacity 0.08s linear' }}
          fontFamily="monospace" fontSize="5" fill="#5a5b62">
          <line x1="48" y1="50"  x2="52" y2="50"  stroke="#34353b" strokeWidth="0.4"/>
          <line x1="48" y1="100" x2="52" y2="100" stroke="#34353b" strokeWidth="0.4"/>
          <line x1="48" y1="150" x2="52" y2="150" stroke="#34353b" strokeWidth="0.4"/>
          <line x1="48" y1="178" x2="52" y2="178" stroke="#34353b" strokeWidth="0.4"/>
          <text x="54" y="180">0</text>
        </g>
      </svg>
    </div>
  );
};

window.Pendulum = Pendulum;
