import { useState, useEffect } from 'react'

const HERO_WORDS = [
  { text: 'AWAKENING',   bg: '#1c1c1c', fg: '#e2ff0d', accent: 'star',   tilt: -6, label: '01 · ENERGY',  viz: 'AWAKE' },
  { text: 'HUMAN',       bg: '#f35544', fg: '#1c1c1c', accent: 'face',   tilt:  4, label: '02 · FACES',   viz: 'YOU' },
  { text: 'POTENTIAL',   bg: '#e2ff0d', fg: '#1c1c1c', accent: 'arrow',  tilt: -3, label: '03 · SIGNAL',  viz: '↗' },
  { text: 'THROUGH',     bg: '#d142a4', fg: '#ffffff', accent: 'dots',   tilt:  6, label: '04 · LOOP',    viz: '∞' },
  { text: 'CREATIVITY,', bg: '#5944ff', fg: '#e2ff0d', accent: 'splash', tilt: -5, label: '05 · IDEAS',   viz: '!' },
  { text: 'CULTURE',     bg: '#22b656', fg: '#1c1c1c', accent: 'grid',   tilt:  4, label: '06 · CREW',    viz: 'WE' },
  { text: 'AND',         bg: '#2892fb', fg: '#1c1c1c', accent: 'plus',   tilt: -2, label: '07 · LINK',    viz: '×' },
  { text: 'TECH.',       bg: '#1c1c1c', fg: '#2892fb', accent: 'code',   tilt:  6, label: '08 · BUILD',   viz: 'TOOL' },
]

const MARQUEE_ITEMS = [
  'Low Ego Company', 'Curation is our superpower',
  'Human First', 'Culture as Signal',
  'Tech as Tool', 'Cool tech for curious people',
  'Less noise. More intention.',
]

function AccentArt({ kind, color: c }) {
  const s = { position: 'absolute', inset: 0, width: '100%', height: '100%' }
  switch (kind) {
    case 'star':
      return <svg viewBox="0 0 100 100" style={s}><path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill={c} opacity="0.95" /></svg>
    case 'face':
      return <svg viewBox="0 0 200 280" style={s}><circle cx="100" cy="120" r="70" fill={c} opacity="0.85" /><ellipse cx="100" cy="250" rx="120" ry="50" fill={c} opacity="0.6" /></svg>
    case 'arrow':
      return <svg viewBox="0 0 200 280" style={s}><path d="M20 240 L160 60 M160 60 L160 140 M160 60 L80 60" stroke={c} strokeWidth="22" fill="none" strokeLinecap="square" /></svg>
    case 'dots':
      return (
        <svg viewBox="0 0 200 280" style={s}>
          {Array.from({ length: 60 }).map((_, i) => (
            <circle key={i} cx={20 + (i % 8) * 22} cy={20 + Math.floor(i / 8) * 36} r={2 + (i % 4)} fill={c} opacity={0.4 + (i % 5) * 0.12} />
          ))}
        </svg>
      )
    case 'splash':
      return <svg viewBox="0 0 200 280" style={s}><path d="M20 140 Q 60 60 100 130 T 180 120 Q 150 200 100 180 T 30 220 Z" fill={c} opacity="0.85" /></svg>
    case 'grid':
      return (
        <svg viewBox="0 0 200 280" style={s}>
          {Array.from({ length: 9 }).map((_, i) => (
            <rect key={i} x={20 + (i % 3) * 60} y={20 + Math.floor(i / 3) * 80} width="50" height="70" fill={c} opacity={0.5 + (i % 4) * 0.12} />
          ))}
        </svg>
      )
    case 'plus':
      return <svg viewBox="0 0 200 280" style={s}><rect x="80" y="40" width="40" height="200" fill={c} /><rect x="0" y="120" width="200" height="40" fill={c} /></svg>
    case 'code':
      return (
        <svg viewBox="0 0 200 280" style={s}>
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x="20" y={20 + i * 20} width={40 + (i * 23) % 140} height="6" fill={c} opacity={0.5 + (i % 4) * 0.15} />
          ))}
        </svg>
      )
    default: return null
  }
}

function FloatingCards() {
  return (
    <div className="float-cards" aria-hidden="true">
      <div className="tilt-card c1">
        <div><div className="card-num">01</div><div className="card-tag">The Filter</div></div>
        <div className="card-body">Curation is our superpower. We don't do everything.</div>
        <div className="card-tag">SCROLL ↘</div>
      </div>
      <div className="tilt-card c2">
        <div><div className="card-num">02</div><div className="card-tag">Low Ego</div></div>
        <div className="card-body">Awareness, not absence of confidence.</div>
        <div className="card-tag">2025 ©</div>
      </div>
      <div className="tilt-card c3">
        <div><div className="card-num">03</div><div className="card-tag">The Signal</div></div>
        <div className="card-body">One mark. Curation seal. Brand intervention.</div>
        <div className="card-tag">★</div>
      </div>
      <div className="tilt-card c4">
        <div><div className="card-num">04</div><div className="card-tag">The Drop</div></div>
        <div className="card-body">La marca no solo se comunica. Se materializa.</div>
        <div className="card-tag">MX → WORLD</div>
      </div>
    </div>
  )
}

function MediaTile({ active, x, y }) {
  return (
    <div
      className={`media-tile ${active ? 'is-on' : 'is-off'}`}
      style={active ? {
        transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${active.tilt}deg)`,
        background: active.bg,
        color: active.fg,
      } : { transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(0)` }}
      aria-hidden="true"
    >
      {active && (
        <>
          <AccentArt kind={active.accent} color={active.fg} />
          <div className="stage" style={{ color: active.fg, position: 'relative', zIndex: 2 }}>{active.viz}</div>
          <div className="tile-label" style={{ zIndex: 2 }}>{active.label}</div>
          <div className="tile-num" style={{ zIndex: 2 }}>CNP</div>
        </>
      )}
    </div>
  )
}

export default function Hero({ showCards = true }) {
  const [tile, setTile] = useState(null)
  const [pos, setPos] = useState({ x: -200, y: -200 })

  useEffect(() => {
    const move = e => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <section className="hero">
      {showCards && <FloatingCards />}

      <div className="hero-top">
        <div className="hero-bar">
          <div className="left">
            <span className="dot" />
            <span>Cool Nerdy People · MX → World</span>
          </div>
        </div>
        <nav className="hero-nav">
          <img src="/assets/logo-silencioso-white.png" alt="CNP" className="logo-mini" />
          <a href="#">Studio</a>
          <a href="#">Work</a>
          <a href="#">Journal</a>
          <a href="#">The Drop</a>
          <a className="cta" href="#">Let's talk <span style={{ fontSize: 14 }}>↗</span></a>
        </nav>
        <div className="hero-bar">
          <div className="right">
            <span>EN · ES</span>
            <span>2025 ©</span>
          </div>
        </div>
      </div>

      <div className="hero-main">
        <h1 className="hero-headline">
          {HERO_WORDS.map((w, i) => (
            <span
              key={i}
              className="word"
              onMouseEnter={() => setTile(w)}
              onMouseLeave={() => setTile(null)}
            >
              {w.text}
            </span>
          ))}
        </h1>
      </div>

      <MediaTile active={tile} x={pos.x} y={pos.y} />

      <div className="hero-foot">
        <div className="wordmark">
          <img src="/assets/logo-creativo-black.png" alt="Cool Nerdy People" />
        </div>
        <div className="scroll-cue">
          <span>Scroll</span>
          <div className="arrow" />
          <span>The Code ↓</span>
        </div>
        <div className="socials">
          <a href="#">IG.</a>
          <a href="#">In.</a>
          <a href="#">Tk.</a>
        </div>
      </div>

      <div className="hero-marquee" aria-hidden="true">
        <div className="track">
          {[0, 1].map(copy => (
            <span key={copy} style={{ display: 'inline-flex', gap: 36, alignItems: 'center' }}>
              {MARQUEE_ITEMS.map((item, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 36 }}>
                  {item}<span className="star4" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
