/* ProjectExpand.jsx — immersive project overlay */

function ProjectExpand({ project, onClose }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (project) {
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  return (
    <div className={`pe ${project ? 'open' : ''}`} onClick={onClose}>
      <div className="pe-card" onClick={(e)=>e.stopPropagation()}>
        {project && (
          <>
            <div className="pe-cover">
              <div className="pe-cover-art">
                <CoverArt kind={project.cover}/>
              </div>
              <div className="pe-cover-grad"/>
              <div className="pe-cover-grain"/>
              <div className="pe-cover-meta">
                <span>{project.n} / 06</span>
                <span>·</span>
                <span>{project.year}</span>
                <span>·</span>
                <span>{project.context}</span>
              </div>
              <div className="pe-cover-play" aria-hidden="true">
                <svg viewBox="0 0 60 60" width="60" height="60">
                  <circle cx="30" cy="30" r="29" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6"/>
                  <polygon points="24,20 24,40 42,30" fill="#fff"/>
                </svg>
                <span>preview · 00:42</span>
              </div>
            </div>
            <div className="pe-info">
              <button className="pe-close" onClick={onClose} aria-label="close">
                <svg viewBox="0 0 20 20" width="14" height="14">
                  <line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" strokeWidth="1.4"/>
                  <line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" strokeWidth="1.4"/>
                </svg>
              </button>
              <div className="pe-meta">
                <span>{project.context}</span>
                <span className="pe-dot">·</span>
                <span>{project.year}</span>
              </div>
              <h2 className="pe-title">{project.title}</h2>
              <p className="pe-desc">{project.desc}</p>

              <div className="pe-stats">
                <div className="pe-stat"><span>Role</span><strong>{project.role}</strong></div>
                <div className="pe-stat"><span>Year</span><strong>{project.year}</strong></div>
                <div className="pe-stat"><span>Domain</span><strong>{project.context}</strong></div>
                <div className="pe-stat"><span>Status</span><strong style={{color:'var(--iri-2)'}}>● Live</strong></div>
              </div>

              <div className="pe-tags-wrap">
                <h5>Stack</h5>
                <div className="pe-tags">{project.tags.map(t => <span key={t}>{t}</span>)}</div>
              </div>

              <div className="pe-actions">
                <a className="btn btn-primary" href="#">View case study →</a>
                <a className="btn btn-ghost" href="#">Source</a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

window.ProjectExpand = ProjectExpand;
