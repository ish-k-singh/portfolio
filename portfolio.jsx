const { useState, useEffect, useMemo } = React;

// Fetch playlist/album/track metadata via Spotify's public oEmbed endpoint.
// Returns { title, thumbnail_url } — no auth required, works from the browser.
function useSpotifyMeta(url){
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState(null);
  useEffect(()=>{
    if(!url){ setMeta(null); setError(null); return; }
    let cancelled = false;
    setError(null);
    fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`)
      .then(r => {
        if(!r.ok) throw new Error('oEmbed ' + r.status);
        return r.json();
      })
      .then(json => { if(!cancelled) setMeta(json); })
      .catch(e => { if(!cancelled) { setError(e.message); setMeta(null); } });
    return () => { cancelled = true; };
  }, [url]);
  return { meta, error };
}

// ============ Tweaks ==========================
function PortfolioTweaks({ t, setTweak }){
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Identity">
        <TweakText label="Name" value={t.name} onChange={v=>setTweak('name', v)} />
        <TweakText label="Role" value={t.role} onChange={v=>setTweak('role', v)} />
        <TweakText label="Email" value={t.email} onChange={v=>setTweak('email', v)} />
        <TweakToggle label="Open to work" value={t.openToWork} onChange={v=>setTweak('openToWork', v)} />
      </TweakSection>
      <TweakSection label="Now playing">
        <TweakText
          label="Center (main)"
          value={t.spotifyUrl}
          onChange={v=>setTweak('spotifyUrl', v)}
        />
        <TweakText
          label="Left album"
          value={t.spotifyUrl2}
          onChange={v=>setTweak('spotifyUrl2', v)}
        />
        <TweakText
          label="Right album"
          value={t.spotifyUrl3}
          onChange={v=>setTweak('spotifyUrl3', v)}
        />
      </TweakSection>
      <TweakSection label="Reading">
        <TweakText label="Book" value={t.bookTitle} onChange={v=>setTweak('bookTitle', v)} />
        <TweakText label="Author" value={t.bookAuthor} onChange={v=>setTweak('bookAuthor', v)} />
      </TweakSection>
      <TweakSection label="Style">
        <TweakColor
          label="Accent"
          value={t.accent}
          options={['#e8643a','#3a6df0','#1f8a5b','#9b59ff','#0d0d0c']}
          onChange={v=>setTweak('accent', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

// Stylized cover that scales the title to fit
function BookCover({ title }){
  // pick a font-size based on length so longer titles still fit
  const len = (title || '').length;
  const size = len <= 6 ? 76 : len <= 9 ? 60 : len <= 12 ? 48 : 36;
  return (
    <div className="book" aria-hidden>
      <div className="book-title" style={{ fontSize: `${size}px` }}>{(title || '').toLowerCase()}</div>
      <div className="book-meta">FSG · NOVEL</div>
    </div>
  );
}

// ============ Main ==========================
function App(){
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);

  useEffect(()=>{
    document.documentElement.style.setProperty('--accent', t.accent);
  }, [t.accent]);

  const firstName = (t.name || '').split(' ')[0] || t.name;

  // Carousel: 3 spotify slots, click a side album to bring it to front.
  const tracks = [t.spotifyUrl, t.spotifyUrl2, t.spotifyUrl3];
  const [active, setActive] = useState(0);
  const { meta: m0 } = useSpotifyMeta(tracks[0]);
  const { meta: m1 } = useSpotifyMeta(tracks[1]);
  const { meta: m2 } = useSpotifyMeta(tracks[2]);
  const metas = [m0, m1, m2];
  const activeMeta = metas[active];
  const activeUrl  = tracks[active];

  return (
    <>
      <div className="page">
        {/* Top nav — centered */}
        <header className="nav">
          <nav className="nav-links">
            <a className="nav-link" href="index.html">Home</a>
            <a className="nav-link" href="projects.html">Projects</a>
            <a className="nav-link" href={`mailto:${t.email}`}>Contact</a>
          </nav>
        </header>

        {/* Hero */}
        <section className="hero">
          <h1 className="headline">
            Hi, I'm{' '}
            <span className="portrait-chip" aria-hidden>
              <img src="headshot.webp" alt="" className="portrait-img" />
            </span>
            <span className="nbsp">{firstName}!</span>
            <br/>
            <span className="muted">I'm a</span>{' '}
            <span className="accent">{t.role}.</span>
            {t.openToWork && (
              <span className="pill">
                <span className="dot" />
                Open to work
              </span>
            )}
          </h1>

          <div className="cta-row">
            <a className="btn" href={`mailto:${t.email}`}>
              Contact me
              <span className="arrow">→</span>
            </a>
            <p className="cta-copy">
              Feel free to explore my portfolio and reach out — I'd love to connect.
            </p>
          </div>
        </section>

        {/* Bento */}
        <section className="bento">
          {/* Experience */}
          <div className="card c-experience">
            <span className="card-tag">My experience</span>
            <div className="timeline">
              <div className="tl-row">
                <div className="tl-title">Business Analyst II · Amazon</div>
                <div className="tl-meta">Nov 2025 — Present · Music Licensing</div>
              </div>
              <div className="tl-row">
                <div className="tl-title">Program / Product Manager Intern · Shimmer</div>
                <div className="tl-meta">Jun 2025 — Dec 2025 · AI Startup</div>
              </div>
              <div className="tl-row">
                <div className="tl-title">Independent Operations & Systems Consultant</div>
                <div className="tl-meta">Jun 2023 — Jun 2025 · Freelance</div>
              </div>
              <div className="tl-row">
                <div className="tl-title">Business Analyst · Wells Fargo</div>
                <div className="tl-meta">Jan 2022 — Dec 2022 · Full‑time</div>
              </div>
              <div className="tl-row">
                <div className="tl-title">Business Systems Analyst · Yantra</div>
                <div className="tl-meta">Jan 2021 — Dec 2021 · Full‑time</div>
              </div>
            </div>
          </div>

          {/* Playlist — click side albums to bring to front */}
          <div className="card c-playlist">
            <span className="card-tag">What I'm listening to</span>
            <div className="playlist-stack">
              {[0,1,2].map((slotIdx) => {
                // slot positions cycle so the active item is always center
                // left slot shows (active-1), center shows active, right shows (active+1)
                const trackIdx = (active + (slotIdx - 1) + 3) % 3;
                const meta = metas[trackIdx];
                const url = tracks[trackIdx];
                const pos = slotIdx === 1 ? 'pos-center' : slotIdx === 0 ? 'pos-left' : 'pos-right';
                const onClick = (e) => {
                  if (slotIdx === 1) {
                    // center is clicked — open spotify
                    if (!url) e.preventDefault();
                    return;
                  }
                  e.preventDefault();
                  setActive(trackIdx);
                };
                const Tag = slotIdx === 1 ? 'a' : 'div';
                const tagProps = slotIdx === 1
                  ? { href: url || '#', target: '_blank', rel: 'noopener noreferrer' }
                  : { role: 'button', tabIndex: 0,
                      onKeyDown: (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); setActive(trackIdx); } } };
                return (
                  <Tag
                    key={slotIdx}
                    className={`album ${pos} bg-${trackIdx}`}
                    onClick={onClick}
                    title={meta?.title || ''}
                    aria-label={slotIdx === 1 ? 'Open in Spotify' : 'Bring to front'}
                    {...tagProps}
                  >
                    {meta?.thumbnail_url && (
                      <img className="cover-img" src={meta.thumbnail_url} alt="" />
                    )}
                    <span className="play-badge" aria-hidden />
                  </Tag>
                );
              })}
            </div>
            <div className="playlist-foot">
              <div className="playlist-title">
                <a
                  className="playlist-title-link"
                  href={activeUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {activeMeta?.title || 'Add Spotify links in Tweaks'}
                </a>
              </div>
              <div className="playlist-sub">
                <span className="play" /> On Spotify
              </div>
            </div>
          </div>

          {/* Reading */}
          <div className="card c-reading">
            <div className="reading-head">
              <span className="card-tag">What I'm reading</span>
              <div className="reading-title">{t.bookTitle}</div>
              <div className="reading-author">{t.bookAuthor}</div>
            </div>
            <BookCover title={t.bookTitle} />
          </div>

          {/* Projects */}
          <div className="card c-projects" id="work">
            <div className="projects-head">
              <span className="card-tag">Selected work</span>
              <a className="all-projects-link" href="projects.html">All projects →</a>
            </div>
            <div className="projects-grid">
              <a className="project" href="oura-ux-research.html">
                <div className="proj-thumb t1" />
                <div className="proj-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="9 7 17 7 17 15" />
                  </svg>
                </div>
                <div className="proj-foot">
                  <div className="proj-title">UX Research case study for Oura as they file IPO</div>
                  <div className="proj-meta mono">
                    <span>2025</span><span className="sep" /><span>UX Research</span><span className="sep" /><span>Case study</span>
                  </div>
                </div>
              </a>
              <a className="project" href="https://innovateschools.org/wp-content/uploads/2025/05/Literacy-is-Life-Policy-Brief.pdf" target="_blank" rel="noopener noreferrer">
                <div className="proj-thumb t2" />
                <div className="proj-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="9 7 17 7 17 15" />
                  </svg>
                </div>
                <div className="proj-foot">
                  <div className="proj-title">Literacy is Life — policy brief for Innovate Public Schools</div>
                  <div className="proj-meta mono">
                    <span>2025</span><span className="sep" /><span>Report Design</span><span className="sep" /><span>PDF</span>
                  </div>
                </div>
              </a>
              <a className="project" href="https://innovateschools.org/wp-content/uploads/2026/03/LAUSD-Datasheet-2024-25-English-1.pdf" target="_blank" rel="noopener noreferrer">
                <div className="proj-thumb t3" />
                <div className="proj-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="9 7 17 7 17 15" />
                  </svg>
                </div>
                <div className="proj-foot">
                  <div className="proj-title">LAUSD Datasheet — Innovate Public Schools</div>
                  <div className="proj-meta mono">
                    <span>2026</span><span className="sep" /><span>Report Design</span><span className="sep" /><span>PDF</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-right">
            <a href="#">LinkedIn</a>
            <a href={`mailto:${t.email}`}>Email</a>
          </div>
        </footer>
      </div>

      <PortfolioTweaks t={t} setTweak={setTweak} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
