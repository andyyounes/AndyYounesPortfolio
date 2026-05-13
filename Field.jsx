/* Field.jsx — the actual layout: every artifact placed in space. */

const PROJECTS = [
  { id:'p1', n:'01', title:'Self-Driving', context:'ACC Competition', year:'2024–25', role:'Team Lead',
    desc:'End-to-end autonomous driving stack: perception, sensor fusion, MPC. Vision + LiDAR feeding a model-predictive controller running in real time on race-day hardware.',
    tags:['Vision','LiDAR','MPC','ROS2'], cover:'grid', size:'sq' },
  { id:'p2', n:'02', title:'Drone Swarm', context:'Crazyflie · ROS2', year:'2024–25', role:'Research Asst.',
    desc:'Leader–follower swarm coordination over distributed comms. Decentralized trajectory control, collision avoidance, formation maintenance.',
    tags:['Swarm','Distributed','Trajectory'], cover:'orbits', size:'tall' },
  { id:'p3', n:'03', title:'eVTOL MPC', context:'Aerospace · Research', year:'2025', role:'Researcher',
    desc:'Full 12-DOF nonlinear aerodynamic model with optimization-based trajectory control. From rigid-body dynamics to flyable trajectories.',
    tags:['Optimization','Aero','Control'], cover:'wave', size:'wide' },
  { id:'p4', n:'04', title:'Pikaisso', context:'AI Gesture Painter', year:'2025', role:'Team Lead',
    desc:'Paint with your hands. YOLO + MediaPipe for gesture recognition, XGBoost classifier for stroke intent. Camera in, canvas out.',
    tags:['YOLO','MediaPipe','XGBoost'], cover:'splatter', size:'sq' },
  { id:'p5', n:'05', title:'JustB', context:'Mental Health AI', year:'2025–', role:'Founder',
    desc:'AI chatbot built around crisis detection, grounding exercises, and habit tracking. Designed with safety-first conversational flows.',
    tags:['LLM','NLP','Wellness'], cover:'pulse', size:'tall' },
  { id:'p6', n:'06', title:'VintPixAI', context:'Image Restoration', year:'2024', role:'Developer',
    desc:'Deep-learning pipeline for old-photo restoration: denoise, color, upscale. Built end-to-end as a web platform.',
    tags:['Deep Learning','Vision','GAN'], cover:'pixels', size:'wide' },
];

/* ===== Cover Art ===== */
function CoverArt({ kind }) {
  const common = { position: 'absolute', inset: 0, width: '100%', height: '100%' };
  if (kind === 'grid') return (
    <svg style={common} viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sd-bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0e0e12"/><stop offset="1" stopColor="#1a1024"/>
        </linearGradient>
      </defs>
      <rect width="600" height="400" fill="url(#sd-bg)"/>
      <line x1="0" y1="220" x2="600" y2="220" stroke="rgba(255,255,255,0.12)"/>
      {Array.from({length:11}).map((_,i)=>{
        const x=(i/10)*600;
        return <line key={i} x1={x} y1="220" x2={300+(x-300)*3} y2="400" stroke="rgba(110,231,255,0.4)" strokeWidth="0.6"/>;
      })}
      {[260,300,340,380].map((y,i)=>(<line key={i} x1="0" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.08)"/>))}
      <ellipse cx="300" cy="320" rx="70" ry="14" fill="rgba(182,166,255,0.3)"/>
      <rect x="270" y="295" width="60" height="22" rx="6" fill="rgba(255,154,210,0.55)"/>
    </svg>
  );
  if (kind === 'orbits') return (
    <svg style={common} viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="600" fill="#0c0c10"/>
      <g stroke="rgba(255,255,255,0.18)" fill="none">
        <ellipse cx="200" cy="300" rx="160" ry="60"/>
        <ellipse cx="200" cy="300" rx="120" ry="180" transform="rotate(20 200 300)"/>
        <ellipse cx="200" cy="300" rx="180" ry="100" transform="rotate(-30 200 300)"/>
      </g>
      <circle cx="200" cy="300" r="6" fill="#fff1a8"/>
      <circle cx="358" cy="300" r="3" fill="#6ee7ff"/>
      <circle cx="280" cy="170" r="3" fill="#b6a6ff"/>
      <circle cx="100" cy="380" r="3" fill="#ff9ad2"/>
    </svg>
  );
  if (kind === 'wave') return (
    <svg style={common} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice">
      <rect width="800" height="300" fill="#0c0c10"/>
      {Array.from({length:24}).map((_,i)=>{
        const phase=i/24*Math.PI*2;
        const path=Array.from({length:80}).map((_,j)=>{
          const x=(j/79)*800;
          const y=150+Math.sin(j/79*Math.PI*4+phase)*(30+i*1.5);
          return `${j===0?'M':'L'}${x},${y}`;
        }).join(' ');
        return <path key={i} d={path} stroke={`rgba(110,231,255,${0.08+i*0.005})`} fill="none" strokeWidth="0.6"/>;
      })}
    </svg>
  );
  if (kind === 'splatter') return (
    <svg style={common} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="400" fill="#0c0c10"/>
      {Array.from({length:30}).map((_,i)=>{
        const cx=50+(i*37)%320, cy=50+(i*53)%320, r=4+(i%7)*3;
        const colors=['#b6a6ff','#6ee7ff','#ff9ad2','#fff1a8'];
        return <circle key={i} cx={cx} cy={cy} r={r} fill={colors[i%4]} opacity="0.5"/>;
      })}
      <path d="M120 280 Q140 200 180 200 Q190 150 210 160 Q220 140 240 160 Q260 150 270 180 Q290 190 290 230 L280 320 L130 320 Z"
            fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
    </svg>
  );
  if (kind === 'pulse') return (
    <svg style={common} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="400" fill="#0c0c10"/>
      <g stroke="rgba(110,231,255,0.5)" fill="none" strokeWidth="1">
        <circle cx="200" cy="200" r="40"/>
        <circle cx="200" cy="200" r="80" opacity="0.6"/>
        <circle cx="200" cy="200" r="120" opacity="0.4"/>
        <circle cx="200" cy="200" r="160" opacity="0.2"/>
      </g>
      <path d="M40 200 L120 200 L140 160 L170 240 L190 180 L220 220 L240 200 L360 200" stroke="#ff9ad2" strokeWidth="1.5" fill="none"/>
    </svg>
  );
  if (kind === 'pixels') return (
    <svg style={common} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice">
      <rect width="800" height="300" fill="#0c0c10"/>
      {Array.from({length:16}).map((_,row)=>
        Array.from({length:40}).map((_,col)=>{
          const sat=col/40;
          const colors=['#b6a6ff','#6ee7ff','#ff9ad2','#fff1a8'];
          return <rect key={`${row}-${col}`} x={col*20} y={row*20-10} width="18" height="18"
                       fill={colors[(row+col)%4]} opacity={sat*0.35+0.04}/>;
        })
      )}
    </svg>
  );
  return null;
}

/* ===== Card Sigil ===== */
function CardSigil() {
  return (
    <div className="card-sigil">
      <svg viewBox="0 0 200 200" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.6">
        <g className="ring">
          <circle cx="100" cy="100" r="92"/>
          <circle cx="100" cy="100" r="78" strokeDasharray="2 4"/>
          {Array.from({length:60}).map((_,i)=>{
            const a=(i/60)*Math.PI*2;
            const x1=100+Math.cos(a)*86, y1=100+Math.sin(a)*86;
            const r2=i%5===0?80:83;
            const x2=100+Math.cos(a)*r2, y2=100+Math.sin(a)*r2;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={i%5===0?0.8:0.3}/>;
          })}
        </g>
        <g className="ring-rev">
          <circle cx="100" cy="100" r="62" strokeDasharray="1 3" opacity="0.5"/>
          <polygon points="100,46 146,126 54,126"/>
          <polygon points="100,154 54,74 146,74" opacity="0.5"/>
        </g>
        <g>
          <circle cx="100" cy="100" r="34" stroke="rgba(255,255,255,0.4)"/>
          <circle cx="100" cy="100" r="2" fill="rgba(255,241,168,0.9)" stroke="none"/>
        </g>
      </svg>
      <div className="card-monogram">AY</div>
    </div>
  );
}

/* ===== Profile Card Artifact ===== */
function ProfileCardArt({ onClick }) {
  return (
    <Artifact x={-180} y={-230} z={0} parallax={1.2} float={1} phase={0.4} className="" onClick={onClick}>
      <div className="card-art">
        <div className="card-foil"/>
        <div className="card-spec"/>
        <div className="card-grain"/>
        <div className="card-frame"/>
        <div className="card-content">
          <div className="card-row">
            <span>No. 001</span>
            <span style={{color:'rgba(244,244,240,0.55)'}}>∴ AY ∴</span>
          </div>
          <div className="card-sigil-wrap"><CardSigil/></div>
          <div>
            <div className="card-row" style={{alignItems:'flex-end'}}>
              <div>
                <div className="card-name">Andy Younes</div>
                <div className="card-role">Engineer · Researcher</div>
              </div>
              <div style={{textAlign:'right',fontSize:9,color:'rgba(244,244,240,0.55)'}}>
                <div>YEREVAN</div><div>2026·I</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Artifact>
  );
}

/* ===== Project Artifact ===== */
function ProjectArt({ p, x, y, z, rotate, parallax, phase, onClick }) {
  return (
    <Artifact x={x} y={y} z={z} rotate={rotate} parallax={parallax} phase={phase} onClick={()=>onClick(p)}>
      <div className={`proj-art size-${p.size}`}>
        <div className="proj-cover"><CoverArt kind={p.cover}/></div>
        <div className="proj-iri-overlay"/>
        <div className="proj-spec"/>
        <div className="proj-content">
          <div className="proj-top">
            <span className="proj-num">{p.n} / 06</span>
            <span className="proj-arrow">↗</span>
          </div>
          <div className="proj-bottom">
            <div className="proj-meta">{p.context} · {p.year}</div>
            <h3 className="proj-title">{p.title}</h3>
            <div className="proj-tags">
              {p.tags.map(t=><span key={t}>{t}</span>)}
            </div>
          </div>
        </div>
      </div>
    </Artifact>
  );
}

/* ===== Title Artifact ===== */
function TitleArt({ x, y, z, parallax, phase, children }) {
  return (
    <Artifact x={x} y={y} z={z} parallax={parallax} phase={phase} tilt={false}>
      <div className="title-art">{children}</div>
    </Artifact>
  );
}

/* ===== Text/Manifesto Artifact ===== */
function TextArt({ x, y, z, parallax, phase, label, children, width }) {
  return (
    <Artifact x={x} y={y} z={z} parallax={parallax} phase={phase} tilt={false}>
      <div className="text-art" style={{ width }}>
        {label && <div className="label">{label}</div>}
        <div className="body">{children}</div>
      </div>
    </Artifact>
  );
}

/* ===== Fragment / data card ===== */
function FragmentArt({ x, y, z, parallax, phase, rotate, k, v, sub }) {
  return (
    <Artifact x={x} y={y} z={z} parallax={parallax} phase={phase} rotate={rotate} tilt={true}>
      <div className="frag">
        <span className="k">{k}</span>
        <span className="v">{v}</span>
        {sub && <span style={{color:'var(--fg-faint)',fontSize:9}}>{sub}</span>}
      </div>
    </Artifact>
  );
}

/* ===== Skill chip ===== */
function ChipArt({ x, y, z, parallax, phase, rotate, label }) {
  return (
    <Artifact x={x} y={y} z={z} parallax={parallax} phase={phase} rotate={rotate} tilt={true} float={1.5}>
      <div className="chip-art">{label}</div>
    </Artifact>
  );
}

/* ===== Contact Orb ===== */
function OrbArt({ x, y, z, onClick }) {
  return (
    <Artifact x={x} y={y} z={z} parallax={1.4} phase={2.1} float={1.4} onClick={onClick}>
      <div className="orb">
        <div className="orb-label">say hi<em style={{fontStyle:'italic'}}>.</em></div>
      </div>
    </Artifact>
  );
}

window.PROJECTS = PROJECTS;
window.ProfileCardArt = ProfileCardArt;
window.ProjectArt = ProjectArt;
window.TitleArt = TitleArt;
window.TextArt = TextArt;
window.FragmentArt = FragmentArt;
window.ChipArt = ChipArt;
window.OrbArt = OrbArt;
window.CoverArt = CoverArt;
