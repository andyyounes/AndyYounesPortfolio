// App.jsx — Andy Younes Portfolio v2

const APP_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lightStrength": 1
}/*EDITMODE-END*/;

/* ── Scroll-driven reveal ── */
function useReveal() {
  React.useEffect(() => {
    let io;
    const run = () => {
      document.querySelectorAll('.reveal:not(.in)').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) el.classList.add('in');
      });
      io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.06, rootMargin: '0px 0px -5% 0px' });
      document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
    };
    const r1 = requestAnimationFrame(() => requestAnimationFrame(run));
    const t1 = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in)').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add('in');
      });
    }, 700);
    const t2 = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    }, 2400);
    return () => { cancelAnimationFrame(r1); clearTimeout(t1); clearTimeout(t2); io && io.disconnect(); };
  }, []);
}

/* ── Global cursor light — sets --lx/--ly (%) and --lpx/--lpy (0-1) ── */
function useGlobalLight() {
  React.useEffect(() => {
    let raf;
    let tx = 50, ty = 30, cx = 50, cy = 30;
    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth) * 100;
      ty = (e.clientY / window.innerHeight) * 100;
    };
    const tick = () => {
      cx += (tx - cx) * 0.045;
      cy += (ty - cy) * 0.045;
      const root = document.documentElement;
      root.style.setProperty('--lx',  cx.toFixed(2) + '%');
      root.style.setProperty('--ly',  cy.toFixed(2) + '%');
      root.style.setProperty('--lpx', (cx / 100).toFixed(4));
      root.style.setProperty('--lpy', (cy / 100).toFixed(4));
      raf = requestAnimationFrame(tick);
    };
    const onTouch = (e) => {
      tx = (e.touches[0].clientX / window.innerWidth)  * 100;
      ty = (e.touches[0].clientY / window.innerHeight) * 100;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onTouch, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
      cancelAnimationFrame(raf);
    };
  }, []);
}

/* ── Section depth — scroll immersion ──
   Only activates after first user scroll to avoid fighting the initial reveal
   animation. Each .shell gets scale/opacity/y-shift based on viewport position. */
function useSectionDepth() {
  React.useEffect(() => {
    let raf;
    let scrolled = false;
    const revealTimes = new Map();
    const isTouch = window.matchMedia('(hover: none)').matches;

    const onScroll = () => { scrolled = true; };
    window.addEventListener('scroll', onScroll, { passive: true });

    const tick = () => {
      if (scrolled) {
        const sh = window.innerHeight;
        document.querySelectorAll('.shell.reveal.in').forEach(el => {
          // Record first time we see this element revealed
          if (!revealTimes.has(el)) revealTimes.set(el, Date.now());
          // Skip sections that just revealed (let CSS transition finish)
          if (Date.now() - revealTimes.get(el) < 1200) return;

          if (!el._depth) el._depth = { scale: 1, y: 0 };
          const d = el._depth;
          const r = el.getBoundingClientRect();
          const mid = r.top + r.height / 2;
          const norm = (mid - sh * 0.5) / sh;

          let ts = 1, ty = 0;
          if (norm > 0.48) {
            const t = Math.min(1, (norm - 0.48) / 0.52);
            ts = 1 - t * (isTouch ? 0.010 : 0.022);
            ty = t * (isTouch ? 6 : 15);
          } else if (norm < -0.52) {
            const t = Math.min(1, (-norm - 0.52) / 0.48);
            ts = 1 - t * (isTouch ? 0.006 : 0.014);
            ty = -t * (isTouch ? 4 : 9);
          }

          const ease = 0.09;
          d.scale += (ts - d.scale) * ease;
          d.y     += (ty - d.y)     * ease;

          el.style.transform = `scale(${d.scale.toFixed(4)}) translateY(${d.y.toFixed(2)}px)`;
          el.style.opacity   = '1';
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
}

/* ── Active section tracker ── */
function useActiveSection() {
  const [active, setActive] = React.useState('hero');
  React.useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setActive(e.target.id || 'hero');
      });
    }, { threshold: 0.35 });
    ['hero', 'about', 'work', 'contact'].forEach(id => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

/* ── Wow moment — iridescent sweep on Work section first view ── */
function useWowMoment() {
  const [active, setActive] = React.useState(false);
  const fired = React.useRef(false);
  React.useEffect(() => {
    const el = document.getElementById('work');
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !fired.current) {
        fired.current = true;
        setActive(true);
        setTimeout(() => setActive(false), 2200);
        io.disconnect();
      }
    }, { threshold: 0.18 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return active;
}

/* ── Section snap — large wheel gesture jumps to next/prev section ──
   Threshold 110px: one mouse-wheel click fires it; gentle trackpad doesn't.
   900ms cooldown prevents chaining multiple snaps per flick.
   Touch devices are skipped — they have native momentum scroll. */
function useSectionSnap() {
  React.useEffect(() => {
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    const IDS      = ['hero', 'about', 'work', 'contact'];
    const THRESH   = 110;   // px accumulated before snap triggers
    const COOLDOWN = 900;   // ms lockout after a snap
    const DECAY    = 160;   // ms idle before accumulator resets

    let locked  = false;
    let accum   = 0;
    let decayId = null;

    const getEls = () => IDS.map(id => document.getElementById(id)).filter(Boolean);

    /* Which section index "owns" the current scroll position */
    const currentIdx = () => {
      const ref  = window.scrollY + window.innerHeight * 0.38;
      const list = getEls();
      let idx = 0;
      list.forEach((el, i) => { if (el.offsetTop <= ref) idx = i; });
      return idx;
    };

    const snapTo = (i, dir) => {
      const list = getEls();
      if (i < 0 || i >= list.length) return;

      /* Don't snap if the current section still has content to scroll through */
      const curr = list[currentIdx()];
      if (curr) {
        const r = curr.getBoundingClientRect();
        if (dir > 0 && r.bottom > window.innerHeight + 60) return;
        if (dir < 0 && r.top < -60) return;
      }

      locked = true;
      list[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => { locked = false; accum = 0; }, COOLDOWN);
    };

    const onWheel = (e) => {
      if (locked) { accum = 0; return; }

      accum += e.deltaY;

      clearTimeout(decayId);
      decayId = setTimeout(() => { accum = 0; }, DECAY);

      if (Math.abs(accum) >= THRESH) {
        const dir = accum > 0 ? 1 : -1;
        snapTo(currentIdx() + dir, dir);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      clearTimeout(decayId);
    };
  }, []);
}

/* ── Nav pill indicator ── */
function useNavActive(activeSection) {
  React.useEffect(() => {
    const links  = document.querySelectorAll('.nav-links a');
    const pill   = document.querySelector('.nav-links');
    const ind    = document.querySelector('.nav-indicator');

    links.forEach(a => {
      const href = a.getAttribute('href')?.replace('#', '');
      const active = href === activeSection;
      a.classList.toggle('nav-active', active);

      if (active && ind && pill) {
        const pr = pill.getBoundingClientRect();
        const ar = a.getBoundingClientRect();
        ind.style.left  = (ar.left  - pr.left) + 'px';
        ind.style.width = ar.width + 'px';
        ind.classList.add('visible');
      }
    });

    // Hide indicator when no nav link matches (e.g. hero section)
    const anyActive = [...links].some(a =>
      a.getAttribute('href')?.replace('#', '') === activeSection
    );
    if (!anyActive && ind) ind.classList.remove('visible');
  }, [activeSection]);

  // Click → squish animation + immediate indicator jump
  React.useEffect(() => {
    const links = document.querySelectorAll('.nav-links a');
    const pill  = document.querySelector('.nav-links');
    const ind   = document.querySelector('.nav-indicator');

    const onClick = (e) => {
      const a  = e.currentTarget;
      if (!ind || !pill) return;
      const pr = pill.getBoundingClientRect();
      const ar = a.getBoundingClientRect();
      ind.style.left  = (ar.left  - pr.left) + 'px';
      ind.style.width = ar.width + 'px';
      ind.classList.add('visible');
      ind.classList.remove('press');
      requestAnimationFrame(() => ind.classList.add('press'));
      ind.addEventListener('animationend', () => ind.classList.remove('press'), { once: true });
    };

    links.forEach(a => a.addEventListener('click', onClick));
    return () => links.forEach(a => a.removeEventListener('click', onClick));
  }, []);
}

const ShaderCanvas = window.ShaderCanvas;

/* ═══════════════ App ═══════════════ */
function App() {
  const [t, setTweak]          = useTweaks(APP_DEFAULTS);
  const [hoveredEl, setHoveredEl] = React.useState(null);
  const [shaderIdx, setShaderIdx] = React.useState(0);
  const activeSection = useActiveSection();
  const wowActive     = useWowMoment();

  useReveal();
  useGlobalLight();
  useSectionDepth();
  useNavActive(activeSection);
  useSectionSnap();

  const robotCtx = { section: activeSection, element: hoveredEl };
  const shaders  = window.BG_SHADERS || [];

  return (
    <>
      <ShaderCanvas shaderIdx={shaderIdx}/>
      <div className="global-light"/>
      <div className="bg-noise"/>
      <div className="bg-vignette"/>
      {wowActive && <div className="wow-sweep" aria-hidden="true"/>}

      <nav className="nav">
        <div className="nav-left">
          <div className="nav-mark"/>
          <span className="nav-name">Andy Younes <em>· OBS-01</em></span>
        </div>
        <div className="nav-links">
          <span className="nav-indicator"/>
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-status">
          <span className="pulse"/>
          <span className="pulse-label">Available 2025</span>
        </div>
      </nav>

      <main>
        <Hero robotCtx={robotCtx} onElementHover={setHoveredEl}/>
        <About onElementHover={setHoveredEl}/>
        <Work onElementHover={setHoveredEl}/>
        <Contact onElementHover={setHoveredEl}/>
        <footer className="footer">
          <span>© Andy Younes · 2025</span>
          <span>Designed as a system, not a page</span>
        </footer>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Surface">
          <TweakSlider label="Light strength" value={t.lightStrength}
            onChange={(v) => setTweak('lightStrength', v)} min={0} max={2} step={0.05}/>
        </TweakSection>
        <TweakSection label="Background">
          <TweakRadio
            label="Shader"
            value={shaderIdx}
            options={shaders.map((s, i) => ({ label: s.name, value: i }))}
            onChange={(v) => setShaderIdx(Number(v))}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
