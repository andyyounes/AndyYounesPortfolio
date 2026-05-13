// MiniRobot.jsx — system guide with refined personality
//
// Proximity zones:
//   < 155px  — active tracking (full amplitude)
//   155–340px — curious: subtle lean toward cursor, brighter eyes
//   > 340px  — idle: drifts back to center
//
// Idle look-away: after 4 s of no cursor movement, robot slowly glances
//   to one side, then returns. Resets on any mouse activity.
//
// Click: mechanical blink (rect covers + uncovers eyes) + iridescent pulse ring.

const ROBOT_CONTEXTS = {
  hero:    { eye: '#6dd3ff', ant: '#a98bff', glowBase: 0.55 },
  about:   { eye: '#a98bff', ant: '#a98bff', glowBase: 0.55 },
  work:    { eye: '#f4c780', ant: '#f4c780', glowBase: 0.75 },
  contact: { eye: '#6dd3ff', ant: '#6dd3ff', glowBase: 0.55 },
};

const MiniRobot = ({ context = {} }) => {
  const wrapRef    = React.useRef(null);
  const headRef    = React.useRef(null);
  const eyeLRef    = React.useRef(null);
  const eyeRRef    = React.useRef(null);
  const bodyRef    = React.useRef(null);
  const glowRef    = React.useRef(null);
  const antDotRef  = React.useRef(null);
  const antHaloRef = React.useRef(null);
  const specRef    = React.useRef(null);
  const eyeLDotRef = React.useRef(null);
  const eyeRDotRef = React.useRef(null);
  // Blink overlay rects
  const blinkLRef  = React.useRef(null);
  const blinkRRef  = React.useRef(null);

  const [pulse,    setPulse]    = React.useState(false);
  const [antPulse, setAntPulse] = React.useState(false);
  const [blinking, setBlinking] = React.useState(false);

  /* ── Main animation loop ── */
  React.useEffect(() => {
    let raf;
    // Target head position (-1..1 on each axis)
    let tx = 0, ty = 0;
    // Current (eased)
    let cx = 0, cy = 0;
    // Light-source tracking
    let glx = 0.5, gly = 0.5, slx = 0.5, sly = 0.5;

    // Idle look-away state
    let lastMovedAt = Date.now();
    let idlePhase   = 'center'; // 'center' | 'looking' | 'returning'
    let idleTarget  = 0;
    let idleTimer   = null;

    const scheduleIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (Date.now() - lastMovedAt < 3800) return; // cursor moved recently
        idlePhase  = 'looking';
        idleTarget = Math.random() > 0.5 ? 0.32 : -0.32;
        // Return to center after 2.4 s
        setTimeout(() => { idlePhase = 'center'; idleTarget = 0; scheduleIdle(); }, 2400);
      }, 4000);
    };
    scheduleIdle();

    const onMove = (e) => {
      lastMovedAt = Date.now();
      idlePhase   = 'center';
      idleTarget  = 0;
      scheduleIdle();

      const w = wrapRef.current;
      if (!w) return;
      const r    = w.getBoundingClientRect();
      const rcx  = r.left + r.width  / 2;
      const rcy  = r.top  + r.height / 2;
      const dx   = e.clientX - rcx;
      const dy   = e.clientY - rcy;
      const dist = Math.hypot(dx, dy);

      glx = e.clientX / window.innerWidth;
      gly = e.clientY / window.innerHeight;

      if (dist < 155) {
        // Active tracking zone
        tx = Math.max(-1, Math.min(1, dx / 155));
        ty = Math.max(-1, Math.min(1, dy / 155));
      } else if (dist < 340) {
        // Curious zone — lean gently toward cursor with less amplitude
        const ratio = 1 - (dist - 155) / 185; // 1→0 as dist goes 155→340
        const dir   = dist > 0 ? 1 / dist : 0;
        tx = dx * dir * ratio * 0.28;
        ty = dy * dir * ratio * 0.16;
      } else {
        // Far — drift to idle position
        tx = idleTarget;
        ty = 0;
      }
    };

    const tick = () => {
      // Apply idle look-away when cursor is far
      if (idlePhase === 'looking') {
        tx = idleTarget;
        ty = 0.04;
      }

      cx  += (tx  - cx)  * 0.07;
      cy  += (ty  - cy)  * 0.07;
      slx += (glx - slx) * 0.06;
      sly += (gly - sly) * 0.06;

      const ox = (cx * 3).toFixed(2);
      const oy = (cy * 2).toFixed(2);
      const rot = (cx * 4).toFixed(2);

      if (headRef.current) {
        headRef.current.setAttribute('transform',
          `translate(${ox} ${oy}) rotate(${rot} 100 78)`);
      }
      if (eyeLRef.current) eyeLRef.current.setAttribute('transform',
        `translate(${(cx * 1.2).toFixed(2)} ${(cy * 1.2).toFixed(2)})`);
      if (eyeRRef.current) eyeRRef.current.setAttribute('transform',
        `translate(${(cx * 1.2).toFixed(2)} ${(cy * 1.2).toFixed(2)})`);
      if (bodyRef.current) bodyRef.current.setAttribute('transform',
        `rotate(${(cx * 0.7).toFixed(2)} 100 150)`);

      // Cursor-driven specular on head
      if (specRef.current) {
        specRef.current.setAttribute('cx', (68 + slx * 68).toFixed(1));
        specRef.current.setAttribute('cy', (48 + sly * 60).toFixed(1));
        specRef.current.setAttribute('opacity',
          (0.22 + Math.hypot(cx, cy) * 0.42).toFixed(2));
      }

      raf = requestAnimationFrame(tick);
    };

    // Mobile: touch tracking — same handler, very subtle follow across full screen
    const onTouchMove = (e) => {
      const t = e.touches[0];
      onMove({ clientX: t.clientX, clientY: t.clientY });
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouchMove);
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
    };
  }, []);

  /* ── Section context — eye / antenna colors ── */
  const prevSection = React.useRef('hero');
  React.useEffect(() => {
    const section = context.section || 'hero';
    if (section === prevSection.current) return;
    prevSection.current = section;

    window.dispatchEvent(new CustomEvent('sectionchange', { detail: { section } }));

    const cfg = ROBOT_CONTEXTS[section] || ROBOT_CONTEXTS.hero;
    if (eyeLDotRef.current) eyeLDotRef.current.setAttribute('fill', cfg.eye);
    if (eyeRDotRef.current) eyeRDotRef.current.setAttribute('fill', cfg.eye);
    if (antDotRef.current)  antDotRef.current.setAttribute('fill',  cfg.ant);
    if (antHaloRef.current) antHaloRef.current.setAttribute('fill', cfg.ant);
    if (glowRef.current)    glowRef.current.style.opacity = cfg.glowBase;
  }, [context.section]);

  /* ── Element hover context ── */
  const prevElement = React.useRef(null);
  React.useEffect(() => {
    const el = context.element;
    if (el === prevElement.current) return;
    prevElement.current = el;

    if (el === 'project') {
      setAntPulse(true);
      setTimeout(() => setAntPulse(false), 900);
      if (glowRef.current) glowRef.current.style.opacity = '1.0';
    } else {
      const cfg = ROBOT_CONTEXTS[context.section || 'hero'] || ROBOT_CONTEXTS.hero;
      if (glowRef.current) glowRef.current.style.opacity = cfg.glowBase;
    }
  }, [context.element]);

  /* ── Click / tap: blink + pulse ── */
  const onClick = () => {
    setBlinking(true);
    setTimeout(() => setBlinking(false), 240);
    setPulse(true);
    setTimeout(() => setPulse(false), 650);
  };

  /* ── Long press (mobile): same effect as click ── */
  const lpTimer = React.useRef(null);
  const onTouchStart = () => { lpTimer.current = setTimeout(onClick, 480); };
  const onTouchEnd   = () => clearTimeout(lpTimer.current);

  const cfg = ROBOT_CONTEXTS[context.section || 'hero'] || ROBOT_CONTEXTS.hero;

  return (
    <div className="robot-wrap" ref={wrapRef} onClick={onClick}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      style={{ pointerEvents: 'auto', cursor: 'pointer', touchAction: 'manipulation' }}>
      <svg className="robot-svg" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3a3a44"/>
            <stop offset="35%"  stopColor="#1a1a22"/>
            <stop offset="50%"  stopColor="#54545f"/>
            <stop offset="65%"  stopColor="#1a1a22"/>
            <stop offset="100%" stopColor="#2c2c34"/>
          </linearGradient>
          <linearGradient id="chrome-head" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a4a55"/>
            <stop offset="30%"  stopColor="#1f1f27"/>
            <stop offset="55%"  stopColor="#646470"/>
            <stop offset="80%"  stopColor="#1f1f27"/>
            <stop offset="100%" stopColor="#36363e"/>
          </linearGradient>
          <linearGradient id="iri-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#a98bff" stopOpacity="0.7"/>
            <stop offset="50%"  stopColor="#6dd3ff" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#f4c780" stopOpacity="0.6"/>
          </linearGradient>
          <radialGradient id="eyeGlowL" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%"   stopColor="#cfeaff"  stopOpacity="1"/>
            <stop offset="40%"  stopColor={cfg.eye}  stopOpacity="0.9"/>
            <stop offset="100%" stopColor={cfg.eye}  stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="eyeGlowR" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%"   stopColor="#cfeaff"  stopOpacity="1"/>
            <stop offset="40%"  stopColor={cfg.eye}  stopOpacity="0.9"/>
            <stop offset="100%" stopColor={cfg.eye}  stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="headSpec" cx="0.4" cy="0.3" r="0.55">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
          </radialGradient>
          <filter id="eyeBlur"><feGaussianBlur stdDeviation="2"/></filter>
          <filter id="softshadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6"/>
            <feOffset dx="0" dy="4" result="ob"/>
            <feComponentTransfer><feFuncA type="linear" slope="0.6"/></feComponentTransfer>
            <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="100" cy="218" rx="48" ry="5" fill="#000" opacity="0.5"/>

        {/* Body */}
        <g ref={bodyRef} style={{ transition: 'transform 0.7s cubic-bezier(.22,.61,.36,1)' }}>

          {/* Base */}
          <rect x="78" y="190" width="44" height="22" rx="2" fill="url(#chrome)" stroke="#0a0a0e" strokeWidth="0.5"/>
          <rect x="78" y="190" width="44" height="3"  fill="#54545f" opacity="0.6"/>
          <rect x="62" y="208" width="76" height="6"  rx="1" fill="#0a0a0e" stroke="#2a2a33" strokeWidth="0.5"/>
          <rect x="62" y="208" width="76" height="1"  fill="#54545f" opacity="0.4"/>

          {/* Torso */}
          <path d="M 70 110 L 130 110 Q 138 110 138 118 L 138 188 Q 138 192 134 192 L 66 192 Q 62 192 62 188 L 62 118 Q 62 110 70 110 Z"
            fill="url(#chrome)" stroke="#0a0a0e" strokeWidth="0.6"/>
          <rect x="74" y="120" width="52" height="46" rx="2" fill="#08080c" stroke="#1d1d24" strokeWidth="0.5"/>
          <circle cx="82" cy="130" r="1.6" fill={cfg.ant} opacity="0.9"/>
          <circle cx="88" cy="130" r="1.6" fill="#1d1d24"/>
          <circle cx="94" cy="130" r="1.6" fill="#1d1d24"/>
          <line x1="100" y1="120" x2="100" y2="166" stroke="#1d1d24" strokeWidth="0.5"/>
          <line x1="80"  y1="150" x2="120" y2="150" stroke="#1d1d24" strokeWidth="0.5"/>
          <line x1="80"  y1="155" x2="120" y2="155" stroke="#1d1d24" strokeWidth="0.5"/>
          <line x1="80"  y1="160" x2="120" y2="160" stroke="#1d1d24" strokeWidth="0.5"/>
          <rect x="70"  y="111" width="60" height="2" fill="#7a7a87" opacity="0.5"/>
          <rect x="64"  y="180" width="72" height="1" fill="#54545f" opacity="0.3"/>
          <circle cx="68"  cy="115" r="6" fill="url(#chrome)" stroke="#0a0a0e" strokeWidth="0.5"/>
          <circle cx="132" cy="115" r="6" fill="url(#chrome)" stroke="#0a0a0e" strokeWidth="0.5"/>
          <circle cx="67"  cy="113" r="1.8" fill="#7a7a87" opacity="0.7"/>
          <circle cx="131" cy="113" r="1.8" fill="#7a7a87" opacity="0.7"/>

          {/* Neck */}
          <rect x="92" y="98" width="16" height="14" fill="url(#chrome)" stroke="#0a0a0e" strokeWidth="0.5"/>
          <line x1="92" y1="103" x2="108" y2="103" stroke="#1d1d24" strokeWidth="0.5"/>
          <line x1="92" y1="107" x2="108" y2="107" stroke="#1d1d24" strokeWidth="0.5"/>

          {/* Head */}
          <g ref={headRef} style={{ transition: 'transform 0.5s cubic-bezier(.34,1.2,.64,1)' }}>
            <ellipse cx="100" cy="78" rx="38" ry="36" fill="url(#iri-rim)" opacity="0.18"/>
            <rect x="64" y="48" width="72" height="60" rx="14" fill="url(#chrome-head)" stroke="#0a0a0e" strokeWidth="0.7"/>
            <rect x="68" y="50" width="64" height="2"  rx="1" fill="#8a8a97" opacity="0.5"/>

            {/* Antenna */}
            <line x1="100" y1="48" x2="100" y2="34" stroke="#3a3a44" strokeWidth="1.2"/>
            <circle ref={antDotRef}  cx="100" cy="32" r="2.5" fill={cfg.ant} opacity="0.85"/>
            <circle ref={antHaloRef} cx="100" cy="32" r="5"   fill={cfg.ant} opacity="0.15" filter="url(#eyeBlur)"/>
            {antPulse && (
              <circle cx="100" cy="32" r="9" fill="none" stroke={cfg.ant} strokeWidth="0.8"
                style={{ transformOrigin: '100px 32px', animation: 'antRing 0.9s ease-out forwards' }}/>
            )}

            {/* Faceplate */}
            <rect x="72" y="60" width="56" height="36" rx="6" fill="#06060a" stroke="#1d1d24" strokeWidth="0.5"/>
            <rect x="72" y="60" width="56" height="6"  rx="6" fill="#1a1a22" opacity="0.7"/>

            {/* Eyes */}
            <g ref={glowRef}
              style={{ transition: 'opacity 0.7s cubic-bezier(.22,.61,.36,1)', opacity: cfg.glowBase }}>
              <circle cx="86"  cy="78" r="9" fill="url(#eyeGlowL)" filter="url(#eyeBlur)"/>
              <g ref={eyeLRef} style={{ transition: 'transform 0.25s cubic-bezier(.34,1.2,.64,1)' }}>
                <circle cx="86"  cy="78" r="3"   fill="#ecedef"/>
                <circle ref={eyeLDotRef} cx="86"  cy="78" r="1.4" fill={cfg.eye}/>
              </g>
              <circle cx="114" cy="78" r="9" fill="url(#eyeGlowR)" filter="url(#eyeBlur)"/>
              <g ref={eyeRRef} style={{ transition: 'transform 0.25s cubic-bezier(.34,1.2,.64,1)' }}>
                <circle cx="114" cy="78" r="3"   fill="#ecedef"/>
                <circle ref={eyeRDotRef} cx="114" cy="78" r="1.4" fill={cfg.eye}/>
              </g>
            </g>

            {/* Mechanical blink — two panels slide down and retract over the eyes */}
            {blinking && (
              <g style={{ animation: 'eyeBlink 0.24s cubic-bezier(.4,0,.2,1) forwards' }}>
                <rect x="77"  y="69" width="18" height="12" rx="2" fill="#06060a"/>
                <rect x="105" y="69" width="18" height="12" rx="2" fill="#06060a"/>
              </g>
            )}

            {/* Mouth — subtle smile arc when clicked */}
            <path
              d={pulse
                ? 'M 93 91 Q 100 95 107 91'   /* slight upward arc = smile */
                : 'M 93 91 Q 100 91.5 107 91'  /* neutral / near-flat */
              }
              fill="none" stroke="#54545f" strokeWidth="1.2" strokeLinecap="round"
              style={{ transition: 'd 0.3s var(--ease)' }}
            />

            {/* Ear ports */}
            <rect x="62"  y="72" width="3" height="14" rx="1" fill="url(#chrome)"/>
            <rect x="135" y="72" width="3" height="14" rx="1" fill="url(#chrome)"/>
            <circle cx="72"  cy="103" r="1" fill="#1d1d24"/>
            <circle cx="128" cy="103" r="1" fill="#1d1d24"/>

            {/* Cursor-driven specular */}
            <ellipse ref={specRef} cx="100" cy="62" rx="30" ry="22"
              fill="url(#headSpec)" opacity="0.3"
              style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}/>
          </g>
        </g>

        {/* Click pulse ring */}
        {pulse && (
          <circle cx="100" cy="78" r="40" fill="none" stroke="url(#iri-rim)" strokeWidth="1.5"
            style={{ transformOrigin: '100px 78px', animation: 'robotPulse 0.65s ease-out forwards' }}/>
        )}
      </svg>

      <style>{`
        @keyframes robotPulse {
          0%   { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes antRing {
          0%   { transform: scale(0.6); opacity: 0.9; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes eyeBlink {
          0%   { transform: scaleY(0); transform-origin: center 69px; }
          40%  { transform: scaleY(1); transform-origin: center 69px; }
          60%  { transform: scaleY(1); transform-origin: center 69px; }
          100% { transform: scaleY(0); transform-origin: center 69px; }
        }
      `}</style>
    </div>
  );
};

window.MiniRobot = MiniRobot;
