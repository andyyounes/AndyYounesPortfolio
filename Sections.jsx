// Sections.jsx — Hero, About, Work, Contact

const IS_TOUCH = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

const PROJECTS = [
  { id:'p1', n:'01', title:'Self-Driving Car System', context:'ACC Competition · 2024–25', year:'2024–25', role:'Team Lead',
    desc:'End-to-end autonomous driving stack: vision, sensor fusion, model-predictive control. Real-time perception → control loop running on embedded hardware.',
    tags:['Vision','LiDAR','MPC','ROS2','C++'], cover:'grid', video: 'video_competition.mp4', link: null,
    layout: { left:'0%', top:'0%', width:'58%', height:'42%' } },
  { id:'p2', n:'02', title:'Multi-Drone Coordination', context:'Crazyflie · ROS2', year:'2024–25', role:'Research Asst.',
    desc:'Leader-follower swarm coordination over distributed comms. Decentralized trajectory control with formation maintenance under perturbation.',
    tags:['Swarm','Distributed','Trajectory'], cover:'orbits', video: 'video_drone.mp4', link: null,
    layout: { left:'62%', top:'4%', width:'38%', height:'34%' } },
  { id:'p3', n:'03', title:'eVTOL Nonlinear MPC', context:'Aerospace Research', year:'2025', role:'Researcher',
    desc:'Full 12-DOF nonlinear aerodynamic model with optimization-based trajectory control for vertical take-off vehicles. Covers the complete dynamics from rotor thrust allocation to outer-loop trajectory tracking.',
    tags:['Optimization','Aerodynamics','Control'], cover:'wave', video: null, link: null,
    layout: { left:'52%', top:'42%', width:'48%', height:'30%' } },
  { id:'p4', n:'04', title:'Pikaisso', context:'AI Gesture Painter · Samsung AI Campus', year:'2025', role:'Team Lead',
    desc:'Contactless gesture-based painting for accessible HCI. Built at Samsung Innovation Campus: YOLO detects the hand region, MediaPipe extracts 21 landmarks, XGBoost classifies stroke intent — enabling motor-impaired users to create without physical devices.',
    tags:['YOLO','MediaPipe','XGBoost','Accessibility'], cover:'splatter', video: 'video_pikaisso.mp4', link: null,
    layout: { left:'4%', top:'45%', width:'42%', height:'28%' } },
  { id:'p5', n:'05', title:'JustB', context:'Mental Health AI', year:'2025–', role:'Founder',
    desc:'AI companion built around crisis detection, grounding exercises, and habit tracking. Safety-first model fine-tuning with a focus on responsible deployment in high-stakes wellness contexts.',
    tags:['LLM','NLP','Wellness','Safety'], cover:'pulse', video: null, link: 'https://justbwellness.vercel.app/',
    layout: { left:'0%', top:'76%', width:'46%', height:'24%' } },
  { id:'p6', n:'06', title:'VintPixAI', context:'Image Restoration', year:'2024', role:'Developer',
    desc:'Deep-learning pipeline for old-photo restoration: denoising, color reconstruction, and neural upscaling. Trained on degraded image pairs to recover fine texture and authentic tonality.',
    tags:['Deep Learning','Vision','GAN','Restoration'], cover:'pixels', video: null, link: 'https://vintpixai.vercel.app/#!/',
    layout: { left:'50%', top:'76%', width:'50%', height:'24%' } },
  { id:'p7', n:'07', title:'WCIT 2024 Talk', context:'World Congress on Innovation & Technology', year:'2024', role:'Speaker',
    desc:'Invited 5-minute speaker at WCIT 2024. Presented the ACC self-driving competition: sim-to-hardware transition challenges, MPC-based control under sensor noise, real-time perception constraints, and lessons learned deploying autonomous systems in uncontrolled environments.',
    tags:['Autonomous Systems','MPC','Public Speaking','ROS2'], cover:'grid', video: 'video_wcit.mp4', link: null,
    layout: { left:'0%', top:'106%', width:'54%', height:'26%' } },
  { id:'p8', n:'08', title:'Gesture Recognition Pipeline', context:'Computer Vision Research', year:'2024–25', role:'Lead Developer',
    desc:'Hybrid YOLO + MediaPipe + XGBoost pipeline for real-time gesture recognition. 98% accuracy on defect detection with sub-50ms inference on edge devices. Solved stand-alone classifier failures under lighting variation, background change, and fast hand motion.',
    tags:['YOLO','MediaPipe','XGBoost','Edge AI'], cover:'orbits', video: 'video_gestures.mp4', link: null,
    layout: { left:'58%', top:'106%', width:'42%', height:'26%' } },
];

/* ── Cover Art SVGs ── */
const CoverArt = ({ kind }) => {
  if (kind === 'grid') return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0c0c12"/><stop offset="1" stopColor="#1a1a22"/>
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#g1)"/>
      {[...Array(20)].map((_,i)=><line key={`v${i}`} x1={i*22+10} y1="0"   x2={i*22+10}  y2="300" stroke="#2a2a33" strokeWidth="0.3"/>)}
      {[...Array(15)].map((_,i)=><line key={`h${i}`} x1="0"      y1={i*22+10} x2="400" y2={i*22+10} stroke="#2a2a33" strokeWidth="0.3"/>)}
      <circle cx="200" cy="150" r="4"  fill="#a98bff"/>
      <circle cx="200" cy="150" r="40" fill="none" stroke="#a98bff" strokeWidth="0.6" opacity="0.6"/>
      <circle cx="200" cy="150" r="80" fill="none" stroke="#6dd3ff" strokeWidth="0.4" opacity="0.4"/>
      <path d="M 60 220 Q 200 180 340 100" fill="none" stroke="#6dd3ff" strokeWidth="1" opacity="0.7"/>
      <circle cx="60"  cy="220" r="3" fill="#6dd3ff"/>
      <circle cx="340" cy="100" r="3" fill="#f4c780"/>
    </svg>
  );
  if (kind === 'orbits') return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="#0a0a0e"/>
      <ellipse cx="200" cy="150" rx="160" ry="50"  fill="none" stroke="#a98bff" strokeWidth="0.6" opacity="0.5"/>
      <ellipse cx="200" cy="150" rx="120" ry="80"  fill="none" stroke="#6dd3ff" strokeWidth="0.5" opacity="0.5"/>
      <ellipse cx="200" cy="150" rx="80"  ry="120" fill="none" stroke="#f4c780" strokeWidth="0.4" opacity="0.4"/>
      <circle cx="200" cy="150" r="6" fill="#ecedef"/>
      <circle cx="60"  cy="150" r="3" fill="#a98bff"/>
      <circle cx="340" cy="150" r="3" fill="#6dd3ff"/>
      <circle cx="200" cy="30"  r="3" fill="#f4c780"/>
      <circle cx="200" cy="270" r="3" fill="#a98bff"/>
    </svg>
  );
  if (kind === 'wave') return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="#08080c"/>
      {[...Array(8)].map((_,i)=>{
        const y = 50 + i*30;
        const o = 0.6 - i*0.05;
        return <path key={i} d={`M 0 ${y} Q 100 ${y-20-i*4} 200 ${y} T 400 ${y}`}
          fill="none" stroke={i%2?'#6dd3ff':'#a98bff'} strokeWidth="0.5" opacity={o}/>;
      })}
      <circle cx="200" cy="150" r="3" fill="#f4c780"/>
    </svg>
  );
  if (kind === 'splatter') return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="#0a0a0e"/>
      <path d="M 100 100 Q 200 50 300 150 T 350 250"  fill="none" stroke="#a98bff" strokeWidth="2.4" strokeLinecap="round" opacity="0.85"/>
      <path d="M 80 200 Q 180 180 250 230"             fill="none" stroke="#6dd3ff" strokeWidth="2"   strokeLinecap="round" opacity="0.7"/>
      <path d="M 160 60 Q 220 100 280 80"              fill="none" stroke="#f4c780" strokeWidth="1.6" strokeLinecap="round" opacity="0.6"/>
      <circle cx="120" cy="110" r="4" fill="#a98bff" opacity="0.7"/>
      <circle cx="290" cy="90"  r="3" fill="#f4c780" opacity="0.7"/>
    </svg>
  );
  if (kind === 'pulse') return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="#08080c"/>
      <path d="M 0 150 L 80 150 L 100 110 L 130 190 L 160 80 L 190 200 L 220 130 L 250 150 L 400 150"
        fill="none" stroke="#6dd3ff" strokeWidth="1.4"/>
      {[...Array(40)].map((_,i)=><line key={i} x1={i*10} y1="148" x2={i*10} y2="152" stroke="#1d1d24" strokeWidth="0.4"/>)}
      <circle cx="190" cy="200" r="4" fill="#a98bff"/>
    </svg>
  );
  if (kind === 'pixels') return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="#0c0c12"/>
      {[...Array(180)].map((_,i)=>{
        const x = (i % 20) * 20 + 10;
        const y = Math.floor(i/20) * 20 + 10;
        const o = (Math.sin(i*0.7) + 1) * 0.3 + 0.05;
        const c = i%7===0 ? '#a98bff' : i%5===0 ? '#6dd3ff' : '#2a2a33';
        return <rect key={i} x={x-7} y={y-7} width="14" height="14" fill={c} opacity={o}/>;
      })}
    </svg>
  );
  return null;
};

/* ============================================================
   Hero
   ============================================================ */
const Hero = ({ robotCtx, onElementHover }) => {
  return (
    <section className="shell hero reveal" id="hero" data-screen-label="01 Hero">
      <div className="hero-left">
        <div className="hero-eyebrow">
          <span className="line"/>
          <span><strong style={{ color:'var(--fg)', fontWeight:500, letterSpacing:'0.08em' }}>Andy Younes</strong> <span style={{ opacity:0.45 }}>—</span> Yerevan, Armenia</span>
        </div>
        <h1 className="hero-title">
          AI&nbsp;&amp;<br/>
          robotics<br/>
          <em><span className="iri-line">engineer</span></em><span className="iri-line">.</span>
        </h1>
        <p className="hero-bio">
          Building autonomous systems where perception meets control —
          from self-driving stacks to drone swarms to real-time vision.
        </p>
        <div className="hero-cta">
          <a className="btn btn-primary" href="#work"
            onMouseEnter={() => onElementHover && onElementHover('button')}
            onMouseLeave={() => onElementHover && onElementHover(null)}>
            View Work <span className="arrow">→</span>
          </a>
          <a className="btn btn-ghost" href="#contact"
            onMouseEnter={() => onElementHover && onElementHover('button')}
            onMouseLeave={() => onElementHover && onElementHover(null)}>
            Get in touch
          </a>
        </div>
      </div>
      <div className="hero-stage">
        <div className="stage-frame"/>
        <div className="stage-corners">
          <span className="c tl"/><span className="c tr"/>
          <span className="c bl"/><span className="c br"/>
        </div>
        <div className="stage-meta">UNIT · OBS-01</div>
        <div className="stage-meta-r"><span className="dot"/><span>OBSERVING</span></div>
        <div className="stage-foot">40.1°N · 44.5°E</div>
        <div className="stage-foot-r">v · 2.0</div>
        <Pendulum/>
        <MiniRobot context={robotCtx}/>
      </div>
    </section>
  );
};

/* ============================================================
   BusinessCard — 3-D flip card with metallic finish
   Front: portrait photo + name strip
   Back:  contact information
   Interaction: click to flip, cursor tilt + specular reflection
   ============================================================ */
const BusinessCard = ({ onElementHover }) => {
  const [flipped, setFlipped]   = React.useState(false);
  const tiltRef    = React.useRef(null);   // outer — JS-driven tilt
  const flipRef    = React.useRef(false);  // true during transition (freeze tilt)
  const photoRef   = React.useRef(null);   // portrait-frame for scan reveal
  const revealedRef = React.useRef(false);
  const swipeX     = React.useRef(0);
  const swipeY     = React.useRef(0);

  /* Cursor tilt — smooth rAF interpolation on the outer wrapper */
  React.useEffect(() => {
    let raf;
    let trx = 0, try_ = 0;   // target
    let crx = 0, cry  = 0;   // current (eased)

    const onMove = (e) => {
      if (flipRef.current) return;
      const el = tiltRef.current;
      if (!el) return;
      const r    = el.getBoundingClientRect();
      const rcx  = r.left + r.width  / 2;
      const rcy  = r.top  + r.height / 2;
      const dx   = e.clientX - rcx;
      const dy   = e.clientY - rcy;
      const dist = Math.hypot(dx, dy);
      // Only tilt when cursor is within the card bounds + a small margin
      if (dist < Math.max(r.width, r.height) * 0.75) {
        trx = -(dy / r.height) * 9;
        try_=  (dx / r.width)  * 9;
        // Specular position for both faces
        const mx = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
        const my = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%';
        el.style.setProperty('--card-mx', mx);
        el.style.setProperty('--card-my', my);
      } else {
        trx = 0; try_ = 0;
      }
    };

    const tick = () => {
      crx += (trx - crx) * 0.10;
      cry += (try_ - cry) * 0.10;
      if (tiltRef.current) {
        tiltRef.current.style.transform =
          `rotateX(${crx.toFixed(2)}deg) rotateY(${cry.toFixed(2)}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  /* Scan-reveal the portrait when the card first comes into view */
  React.useEffect(() => {
    const section = document.getElementById('about');
    if (!section) return;
    if (photoRef.current) photoRef.current.classList.add('portrait-pre-reveal');

    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !revealedRef.current) {
        revealedRef.current = true;
        setTimeout(() => {
          const el = photoRef.current;
          if (el) {
            el.classList.remove('portrait-pre-reveal');
            el.classList.add('portrait-revealing');
          }
        }, 600);
        io.disconnect();
      }
    }, { threshold: 0.30 });
    io.observe(section);
    return () => io.disconnect();
  }, []);

  const handleFlip = () => {
    flipRef.current = true;
    setFlipped(f => !f);
    setTimeout(() => { flipRef.current = false; }, 950);
  };

  // Swipe gesture — horizontal swipe flips the card; ignore if mostly vertical (scroll)
  const onSwipeStart = (e) => {
    swipeX.current = e.touches[0].clientX;
    swipeY.current = e.touches[0].clientY;
  };
  const onSwipeEnd = (e) => {
    const dx = e.changedTouches[0].clientX - swipeX.current;
    const dy = e.changedTouches[0].clientY - swipeY.current;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.4) handleFlip();
  };

  return (
    <div className="bcard-mod">
      <div className="bcard-label-row">
        <span>IDENTITY · A.Y.</span>
        <span className="bcard-hint">{flipped ? '← tap to close' : 'tap · flip for contact'}</span>
      </div>

      {/* perspective wrapper */}
      <div className="bcard-scene" onTouchStart={onSwipeStart} onTouchEnd={onSwipeEnd}>
        {/* tilt wrapper — JS rotates this */}
        <div ref={tiltRef} className="bcard-tilt"
          onMouseEnter={() => onElementHover && onElementHover('card')}
          onMouseLeave={() => onElementHover && onElementHover(null)}>

          {/* flip container */}
          <div className={`bcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>

            {/* ── FRONT ── */}
            <div className="bcard-face bcard-front">
              {/* Photo fills the top ~65% */}
              <div className="bcard-photo portrait-frame" ref={photoRef}>
                <div className="portrait-scan-line"/>
                <img src="portrait.jpeg" alt="Andy Younes"
                  style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', display:'block' }}/>
              </div>

              {/* Name strip */}
              <div className="bcard-strip">
                <div className="bcard-name">Andy Younes</div>
                <div className="bcard-role">AI &amp; Robotics Engineer</div>
                <div className="bcard-loc">Yerevan · Armenia</div>
              </div>

              {/* Iridescent rim + specular */}
              <div className="bcard-rim"/>
              <div className="bcard-spec"/>
            </div>

            {/* ── BACK ── */}
            <div className="bcard-face bcard-back">
              <div className="bcard-back-grid"/>

              <div className="bcard-back-body">
                <div className="bcard-back-initials">A.Y.</div>
                <ul className="bcard-contacts">
                  <li>
                    <span className="bclbl">email</span>
                    <a href="mailto:andymaria55@gmail.com" onClick={e => e.stopPropagation()}>andymaria55@gmail.com</a>
                  </li>
                  <li>
                    <span className="bclbl">phone</span>
                    <span>
                      <a href="tel:+37498550148" onClick={e => e.stopPropagation()}>+374 98 550148</a>
                      {' · '}
                      <a href="tel:+96171550140" onClick={e => e.stopPropagation()}>+961 71 550140</a>
                    </span>
                  </li>
                  <li>
                    <span className="bclbl">github</span>
                    <a href="https://github.com/andyyounes" target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>@andyyounes</a>
                  </li>
                  <li>
                    <span className="bclbl">linkedin</span>
                    <a href="https://www.linkedin.com/in/andy-younes-b84505222/" target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>/in/andy-younes-b84505222</a>
                  </li>
                  <li>
                    <span className="bclbl">utc</span>
                    <span>+4 · Yerevan</span>
                  </li>
                </ul>
              </div>

              {/* Iridescent rim + specular (mirrored) */}
              <div className="bcard-rim"/>
              <div className="bcard-spec"/>
            </div>

          </div>{/* .bcard */}
        </div>{/* .bcard-tilt */}
      </div>{/* .bcard-scene */}
    </div>
  );
};

/* ============================================================
   About — portrait replaced by BusinessCard
   ============================================================ */
const About = ({ onElementHover }) => {
  return (
    <section className="shell reveal" id="about" data-screen-label="02 About">
      <div className="section-head">
        <span>/ 01 — About</span>
        <span className="label-bright">Yerevan · 40.1°N</span>
      </div>
      <h2 className="section-title">
        I build systems that <em>see</em>,<br/>
        <span className="iri">decide</span>, and move<em>.</em>
      </h2>
      <div className="about-grid">
        <div className="about-prose">
          <p>From self-driving stacks racing in competition to swarms of drones coordinating in flight,
            I work where <em>perception</em> meets <em>control</em> — turning sensor noise into decisions in milliseconds.</p>
          <p className="dim">Currently exploring how learning-based controllers can complement classical
            optimization in real-time, safety-critical systems.</p>

          <div className="about-block" style={{ marginTop: '50px' }}>
            <h4>Stack</h4>
            <div className="skills">
              {['Python','C++','PyTorch','ROS2','OpenCV','MPC','YOLO','MediaPipe','CUDA','React','Linux','SLAM'].map(s => (
                <span key={s} className="skill"
                  onMouseEnter={() => onElementHover && onElementHover('skill')}
                  onMouseLeave={() => onElementHover && onElementHover(null)}>
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="about-block">
            <h4>Domains</h4>
            <ul className="about-list">
              <li><span>Autonomous Driving</span><span>2024–25</span></li>
              <li><span>Aerial Robotics</span><span>2024–25</span></li>
              <li><span>Computer Vision</span><span>ongoing</span></li>
              <li><span>Optimal Control</span><span>2025</span></li>
            </ul>
          </div>
        </div>

        <div className="about-side">
          <BusinessCard onElementHover={onElementHover}/>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   Project card — magnetic focus + optional video
   ============================================================ */
const ProjectCard = ({ p, onOpen, onHover }) => {
  const ref         = React.useRef(null);
  const videoRef    = React.useRef(null);
  const [tapFocused, setTapFocused] = React.useState(false);

  // Per-card specular tracking (mouse only)
  const onMouseMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
    ref.current.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
  };

  const onEnter = () => {
    onHover && onHover(true);
    if (videoRef.current && p.video) videoRef.current.play().catch(() => {});
  };
  const onLeave = () => {
    onHover && onHover(false);
    if (videoRef.current && p.video) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Unified click/tap handler
  const handleClick = () => {
    if (!IS_TOUCH) { onOpen(p); return; }
    if (tapFocused) {
      onOpen(p);
    } else {
      setTapFocused(true);
      onHover && onHover(true);
    }
  };

  // Dismiss tap-focus when touching outside this card
  React.useEffect(() => {
    if (!tapFocused) return;
    const dismiss = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setTapFocused(false);
        onHover && onHover(false);
      }
    };
    document.addEventListener('touchstart', dismiss, { passive: true });
    return () => document.removeEventListener('touchstart', dismiss);
  }, [tapFocused]);

  // IntersectionObserver autoplay — lower threshold on touch for partial views
  React.useEffect(() => {
    if (!p.video || !videoRef.current) return;
    const io = new IntersectionObserver((entries) => {
      const v = videoRef.current;
      if (!v) return;
      if (entries[0].isIntersecting) {
        v.play().catch(() => {});
        v.classList.add('autoplay-active');
      } else {
        v.pause();
        v.classList.remove('autoplay-active');
      }
    }, { threshold: IS_TOUCH ? 0.3 : 0.6 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [p.video]);

  return (
    <article
      ref={ref}
      className={`project${tapFocused ? ' tap-focused' : ''}`}
      style={p.layout}
      onMouseMove={IS_TOUCH ? undefined : onMouseMove}
      onMouseEnter={IS_TOUCH ? undefined : onEnter}
      onMouseLeave={IS_TOUCH ? undefined : onLeave}
      onClick={handleClick}
    >
      <div className="project-cover">
        {!p.video && <CoverArt kind={p.cover}/>}
        {p.video && (
          <video ref={videoRef} className="project-video"
            src={p.video} muted loop playsInline preload="metadata"/>
        )}
      </div>
      <div className="project-meta">
        <div className="row">
          <span>/ {p.n}</span>
          <span>{p.year}</span>
        </div>
        <h3 className="project-title">{p.title}</h3>
        <div className="project-context">{p.context}</div>
        <div className="project-role">{p.role}</div>
      </div>
    </article>
  );
};

/* ============================================================
   Project expand overlay
   ============================================================ */
const ProjectExpand = ({ project, onClose }) => {
  const [mounted, setMounted] = React.useState(false);
  const swipeRef = React.useRef(0);

  React.useEffect(() => {
    if (project) {
      requestAnimationFrame(() => setMounted(true));
      const onKey = (e) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
      return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
    } else {
      setMounted(false);
    }
  }, [project, onClose]);

  if (!project) return null;
  const p = project;

  const onTouchStart = (e) => { swipeRef.current = e.touches[0].clientY; };
  const onTouchEnd = (e) => {
    if (e.changedTouches[0].clientY - swipeRef.current > 90) onClose();
  };

  return ReactDOM.createPortal(
    <div className={`pe ${mounted ? 'open' : ''}`} onClick={onClose}>
      <div className="pe-card" onClick={e => e.stopPropagation()}
           onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

        {/* Close button floats over top-right of video */}
        <button className="pe-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 20 20" width="14" height="14">
            <line x1="5" y1="5"  x2="15" y2="15" stroke="currentColor" strokeWidth="1.6"/>
            <line x1="15" y1="5" x2="5"  y2="15" stroke="currentColor" strokeWidth="1.6"/>
          </svg>
        </button>

        <div className="pe-cover">
          <div className="pe-cover-art"><CoverArt kind={p.cover}/></div>
          <div className="pe-cover-grad"/>
          <div className="pe-cover-grain"/>
          <div className="pe-cover-meta">
            <span>/ {p.n}</span>
            <span>·</span>
            <span>{p.context}</span>
          </div>
          {p.video ? (
            <video className="pe-cover-video"
              src={p.video} autoPlay muted loop playsInline
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.7 }}/>
          ) : (
            <div className="pe-cover-play" aria-hidden="true">
              <svg viewBox="0 0 60 60" width="48" height="48">
                <circle cx="30" cy="30" r="29" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6"/>
                <polygon points="24,20 24,40 42,30" fill="#fff" opacity="0.8"/>
              </svg>
              <span>preview · 00:42</span>
            </div>
          )}
        </div>
        <div className="pe-info">
          <div className="pe-meta">
            <span>{p.context}</span>
            <span className="pe-dot">·</span>
            <span>{p.year}</span>
          </div>
          <h2 className="pe-title">{p.title}</h2>
          <p className="pe-desc">{p.desc}</p>
          <div className="pe-stats">
            <div className="pe-stat"><span>Role</span><strong>{p.role}</strong></div>
            <div className="pe-stat"><span>Event</span><strong>{p.context}</strong></div>
            <div className="pe-stat">
              <span>Status</span>
              <strong style={{ color: 'var(--iri-cyan)' }}>{p.link ? '● Live' : '● Active'}</strong>
            </div>
          </div>
          <div className="pe-tags-wrap">
            <h5>Stack</h5>
            <div className="pe-tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
          </div>
          <div className="pe-actions">
            {p.link && (
              <a className="btn btn-primary" href={p.link} target="_blank" rel="noreferrer">
                Live demo <span className="arrow">↗</span>
              </a>
            )}
            <a className={`btn ${p.link ? 'btn-ghost' : 'btn-primary'}`} href="#contact" onClick={onClose}>
              Discuss this <span className="arrow">→</span>
            </a>
            <a className="btn btn-ghost" href="#contact" onClick={onClose}>Request docs</a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ============================================================
   Showcase — auto-advancing video slideshow
   ============================================================ */
const Showcase = ({ onOpen }) => {
  const videos = PROJECTS.filter(p => p.video);
  const [idx, setIdx] = React.useState(0);
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % videos.length), 5000);
    return () => clearInterval(t);
  }, [videos.length]);

  const prev = (e) => { e.stopPropagation(); setIdx(i => (i - 1 + videos.length) % videos.length); };
  const next = (e) => { e.stopPropagation(); setIdx(i => (i + 1) % videos.length); };

  const p = videos[idx];

  return (
    <div className="showcase" onClick={() => onOpen(p)}>
      <video ref={videoRef} key={p.video} src={p.video}
        autoPlay muted loop playsInline className="showcase-video"/>
      <div className="showcase-overlay">
        <div className="showcase-bottom">
          <div className="showcase-info">
            <span className="showcase-n">/ {p.n}</span>
            <h3 className="showcase-title">{p.title}</h3>
            <span className="showcase-context">{p.context}</span>
            <div className="showcase-tags">
              {p.tags.slice(0, 4).map(t => <span key={t}>{t}</span>)}
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:12 }}>
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn btn-ghost" style={{ padding:'8px 14px', fontSize:'10px' }}
                onClick={prev}>←</button>
              <button className="btn btn-ghost" style={{ padding:'8px 14px', fontSize:'10px' }}
                onClick={next}>→</button>
            </div>
            <div className="showcase-dots">
              {videos.map((_, i) => (
                <button key={i} className={'showcase-dot' + (i === idx ? ' active' : '')}
                  onClick={(e) => { e.stopPropagation(); setIdx(i); }}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   Work — magnetic project focus state fed to ProjectCard
   ============================================================ */
const Work = ({ onElementHover }) => {
  const [open,    setOpen]    = React.useState(null);
  const [cardIdx, setCardIdx] = React.useState(0);
  const canvasRef = React.useRef(null);

  // Track horizontal scroll position → update counter (touch carousel)
  React.useEffect(() => {
    const el = canvasRef.current;
    if (!el || !IS_TOUCH) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setCardIdx(Math.max(0, Math.min(idx, PROJECTS.length - 1)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="shell reveal" id="work" data-screen-label="03 Work">
      <div className="section-head">
        <span>/ 02 — Selected Work</span>
        <span className="label-bright">08 entries</span>
      </div>
      <h2 className="section-title">Selected<br/><em>artifacts</em><span className="iri">.</span></h2>
      <Showcase onOpen={setOpen}/>
      <div className="projects-stage">
        <div className="projects-canvas" ref={canvasRef}>
          {PROJECTS.map(p => (
            <ProjectCard key={p.id} p={p} onOpen={setOpen}
              onHover={(on) => onElementHover && onElementHover(on ? 'project' : null)}/>
          ))}
        </div>
        <div className="projects-counter">
          <span className="pcnt-cur">{String(cardIdx + 1).padStart(2, '0')}</span>
          <span> / </span>
          <span>{String(PROJECTS.length).padStart(2, '0')}</span>
        </div>
      </div>
      <ProjectExpand project={open} onClose={() => setOpen(null)}/>
    </section>
  );
};

/* ============================================================
   Contact — metallic control rows
   ============================================================ */
const CROW_ICONS = {
  email: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="3.5" width="12" height="8" rx="1.5"/>
      <polyline points="1.5,4.5 7.5,9 13.5,4.5"/>
    </svg>
  ),
  phone: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 1.5h2.5L7 5 5.5 6a7 7 0 003.5 3.5L10.5 8 13.5 9.5V12a1 1 0 01-1 1A12 12 0 012 2.5a1 1 0 011-1z"/>
    </svg>
  ),
  github: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="7.5" r="5.5"/>
      <path d="M5.5 10c0-1.5.5-2.5 2-2.5s2 1 2 2.5M5.5 7c0-.8 0-1.5.5-2.5M9.5 7c0-.8 0-1.5-.5-2.5"/>
    </svg>
  ),
  linkedin: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="1.5" width="12" height="12" rx="2"/>
      <line x1="4.5" y1="6.5" x2="4.5" y2="10.5"/>
      <circle cx="4.5" cy="4.75" r=".35" fill="currentColor" stroke="none"/>
      <path d="M8 6.5v4m0-2.5c0-1.2.8-1.8 1.8-1.8S11.5 7 11.5 8.2V10.5"/>
    </svg>
  ),
  location: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 1.5A4.5 4.5 0 0112 6c0 3-4.5 7.5-4.5 7.5S3 9 3 6a4.5 4.5 0 014.5-4.5z"/>
      <circle cx="7.5" cy="6" r="1.5"/>
    </svg>
  ),
};

const ContactRow = ({ type, label, value, href, onClick, isStatic, onElementHover }) => {
  const [ripple, setRipple] = React.useState(null);

  const fireRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    setRipple({ x: (cx / rect.width) * 100, y: (cy / rect.height) * 100, k: Date.now() });
    setTimeout(() => setRipple(null), 350);
  };

  const rowProps = {
    className: 'contact-row' + (isStatic ? ' contact-row-static' : ''),
    onMouseEnter: () => onElementHover && onElementHover(onClick ? 'button' : 'link'),
    onMouseLeave: () => onElementHover && onElementHover(null),
  };

  const inner = (
    <>
      <span className="crow-icon">{CROW_ICONS[type]}</span>
      <span className="crow-text">
        <span className="crow-label">{label}</span>
        <span className="crow-value">{value}</span>
      </span>
      {!isStatic && <span className="crow-arrow">↗</span>}
      {ripple && <span key={ripple.k} className="crow-ripple" style={{ left: ripple.x + '%', top: ripple.y + '%' }}/>}
    </>
  );

  if (isStatic) return <div {...rowProps}>{inner}</div>;

  if (onClick) return (
    <button {...rowProps} onClick={(e) => { fireRipple(e); onClick(e); }} onTouchStart={fireRipple}>
      {inner}
    </button>
  );

  return (
    <a {...rowProps} href={href}
       target={href && href.startsWith('http') ? '_blank' : undefined}
       rel={href && href.startsWith('http') ? 'noreferrer' : undefined}
       onClick={fireRipple} onTouchStart={fireRipple}>
      {inner}
    </a>
  );
};

const Contact = ({ onElementHover }) => {
  return (
    <section className="shell reveal" id="contact" data-screen-label="04 Contact">
      <div className="section-head">
        <span>/ 03 — Contact</span>
        <span className="label-bright">Open to opportunities</span>
      </div>
      <div className="contact-grid">
        <h2 className="contact-prompt">Let's build something <em>quietly powerful</em>.</h2>
        <ul className="contact-list">
          <li>
            <ContactRow type="email" label="Email" value="andymaria55@gmail.com"
              href="mailto:andymaria55@gmail.com" onElementHover={onElementHover}/>
          </li>
          <li>
            <div className="contact-row contact-row-static contact-row-phone">
              <span className="crow-icon">{CROW_ICONS.phone}</span>
              <span className="crow-text">
                <span className="crow-label">Phone</span>
                <span className="crow-value">
                  <a href="tel:+37498550148">+374 98 550148</a>
                  {' · '}
                  <a href="tel:+96171550140">+961 71 550140</a>
                </span>
              </span>
            </div>
          </li>
          <li>
            <ContactRow type="github" label="GitHub" value="@andyyounes"
              href="https://github.com/andyyounes" onElementHover={onElementHover}/>
          </li>
          <li>
            <ContactRow type="linkedin" label="LinkedIn" value="/in/andy-younes-b84505222"
              href="https://www.linkedin.com/in/andy-younes-b84505222/" onElementHover={onElementHover}/>
          </li>
          <li>
            <ContactRow type="location" label="Location" value="Yerevan, Armenia · UTC +4"
              isStatic onElementHover={onElementHover}/>
          </li>
        </ul>
      </div>
    </section>
  );
};

window.Hero    = Hero;
window.About   = About;
window.Work    = Work;
window.Contact = Contact;
window.PROJECTS = PROJECTS;
window.CoverArt = CoverArt;
