import { useState, useEffect, useRef, memo, useMemo } from 'react'

const TENETS = [
  {
    idx: '01', a: 'HUMAN', b: 'FIRST.',
    body: 'Behind every screen, every interface and every algorithm, there is a human. We build for them — not for the platform.',
    es: 'EL HUMANO PRIMERO', bg: '#f35544', viz: 'YOU.',
  },
  {
    idx: '02', a: 'CULTURE AS', b: 'SIGNAL.',
    body: 'Culture is not background — it is data. We read it, translate it, and remix it into work that speaks the moment.',
    es: 'LA CULTURA COMO SEÑAL', bg: '#d142a4', viz: '★',
  },
  {
    idx: '03', a: 'TECH AS', b: 'TOOL.',
    body: 'Technology is a means, never the message. We use it with intent — the right amount, in the right place, for the right reason.',
    es: 'LA TECNOLOGÍA COMO HERRAMIENTA', bg: '#5944ff', viz: '{ }',
  },
]

const ManifestoBg = memo(function ManifestoBg({ mouseX, mouseY, style }) {
  if (style === 'grid') {
    return (
      <div className="manifesto-bg manifesto-bg--grid" aria-hidden="true">
        <div className="grid-lines" style={{ transform: `translate(${mouseX * 0.02}px, ${mouseY * 0.02}px)` }} />
        <div className="vignette" />
      </div>
    )
  }
  if (style === 'scan') {
    return (
      <div className="manifesto-bg manifesto-bg--scan" aria-hidden="true">
        <div className="scan-lines" />
        <div className="scan-glow" style={{ transform: `translate(${mouseX * 0.05}px, ${mouseY * 0.05}px)` }} />
        <div className="vignette" />
      </div>
    )
  }
  return (
    <div className="manifesto-bg" aria-hidden="true">
      <div className="blob b1" style={{ transform: `translate(${mouseX * 0.04}px, ${mouseY * 0.04}px)` }} />
      <div className="blob b2" style={{ transform: `translate(${mouseX * -0.05}px, ${mouseY * 0.03}px)` }} />
      <div className="blob b3" style={{ transform: `translate(${mouseX * 0.06}px, ${mouseY * -0.04}px)` }} />
      <div className="blob b4" style={{ transform: `translate(${mouseX * -0.03}px, ${mouseY * -0.05}px)` }} />
      <div className="vignette" />
    </div>
  )
})

export default function Manifesto({ bgStyle = 'blobs' }) {
  const [hovered, setHovered] = useState(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [scrollProgress, setScrollProgress] = useState(0)
  const sectionRef = useRef(null)
  const revealRef = useRef(null)
  // Track raw mouse pos in a ref — no re-render needed for the reveal tile position
  const posRef = useRef({ x: -300, y: -300 })
  const mouseRawRef = useRef({ x: 0, y: 0 })
  const hoveredRef = useRef(null)
  const mousePendingRef = useRef(false)
  const scrollPendingRef = useRef(false)

  useEffect(() => {
    const onMove = e => {
      posRef.current = { x: e.clientX, y: e.clientY }
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2
      mouseRawRef.current = { x: e.clientX - cx, y: e.clientY - cy }

      // Apply reveal-tile position directly to the DOM — bypasses React re-render entirely
      if (revealRef.current) {
        const h = hoveredRef.current
        const idx = h ? TENETS.indexOf(h) : -1
        revealRef.current.style.transform = h
          ? `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) scale(1) rotate(${idx % 2 === 0 ? -3 : 3}deg)`
          : `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) scale(0.7)`
      }

      // Throttle background parallax state updates to one per animation frame
      if (!mousePendingRef.current) {
        mousePendingRef.current = true
        requestAnimationFrame(() => {
          mousePendingRef.current = false
          setMouse({ x: mouseRawRef.current.x, y: mouseRawRef.current.y })
        })
      }
    }

    const onScroll = () => {
      if (scrollPendingRef.current) return
      scrollPendingRef.current = true
      requestAnimationFrame(() => {
        scrollPendingRef.current = false
        if (!sectionRef.current) return
        const rect = sectionRef.current.getBoundingClientRect()
        const total = rect.height + window.innerHeight
        setScrollProgress(Math.max(0, Math.min(1, 1 - rect.bottom / total)))
      })
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Keep hoveredRef in sync and update reveal-tile appearance without waiting for mouse move
  useEffect(() => {
    hoveredRef.current = hovered
    if (revealRef.current) {
      const { x, y } = posRef.current
      const idx = hovered ? TENETS.indexOf(hovered) : -1
      revealRef.current.style.transform = hovered
        ? `translate(${x}px, ${y}px) translate(-50%, -50%) scale(1) rotate(${idx % 2 === 0 ? -3 : 3}deg)`
        : `translate(${x}px, ${y}px) translate(-50%, -50%) scale(0.7)`
      revealRef.current.style.background = hovered?.bg ?? '#000'
    }
  }, [hovered])

  // Memoize per-tenet animation calculations so they don't rerun on hover state changes
  const tenets = useMemo(() => TENETS.map((t, i) => {
    const start = 0.05 + i * 0.05
    const end   = 0.40 + i * 0.05
    const p = Math.max(0, Math.min(1, (scrollProgress - start) / (end - start)))
    return { t, i, p, offsetA: (1 - p) * (i % 2 === 0 ? -120 : 120), offsetB: (1 - p) * (i % 2 === 0 ? 80 : -80) }
  }), [scrollProgress])

  const hoveredIdx = hovered ? TENETS.indexOf(hovered) : -1

  return (
    <section className="manifesto" ref={sectionRef}>
      <ManifestoBg mouseX={mouse.x} mouseY={mouse.y} style={bgStyle} />

      <div className="manifesto-inner">
        <div className="manifesto-meta">
          <div className="left">
            <span className="num">[ 02 ]</span>
            <span>The Code ✦</span>
            <span>Three principles. No exceptions.</span>
          </div>
          <div className="right">
            En un mundo saturado de ideas, nuestro valor no es producir más. Es elegir mejor.{' '}
            <strong style={{ color: 'var(--cnp-acid)' }}>Esto es lo que filtra todo.</strong>
          </div>
        </div>

        <div className="manifesto-list">
          {tenets.map(({ t, i, p, offsetA, offsetB }) => {
            return (
              <div
                key={t.idx}
                className="tenet"
                onMouseEnter={() => setHovered(t)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="idx">{t.idx} /03</div>
                <h2 className="title">
                  <span className="row">
                    <span
                      className="filled"
                      style={{ display: 'inline-block', transform: `translateX(${offsetA}px)`, opacity: 0.3 + 0.7 * p }}
                    >
                      {t.a}
                    </span>
                    <span className="star">✦</span>
                  </span>
                  <span
                    className="stroked"
                    style={{ display: 'inline-block', transform: `translateX(${offsetB}px)`, opacity: 0.3 + 0.7 * p }}
                  >
                    {t.b}
                  </span>
                </h2>
                <div className="side">
                  <div className="es">★ {t.es}</div>
                  <p className="body-text">{t.body}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="manifesto-foot">
          <div>
            <span style={{ color: 'var(--cnp-acid)' }}>✦</span>
            &nbsp;&nbsp;Low Ego Company · Curaduría sobre producción
          </div>
          <a className="pill" href="#">Read the brand book ↗</a>
          <div>↘ Scroll · The Filter / The Signature / The Build</div>
        </div>
      </div>

      {/* Cursor reveal tile — position/transform applied via ref to avoid React re-renders */}
      <div
        ref={revealRef}
        className={`reveal-tile ${hovered ? 'is-on' : ''}`}
        style={{
          transform: `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%) scale(0.7)`,
          background: hovered?.bg ?? '#000',
          color: '#fff',
        }}
        aria-hidden="true"
      >
        <div className="stage">{hovered?.viz ?? ''}</div>
        {hovered && (
          <div style={{
            position: 'absolute', left: 12, bottom: 12, padding: '6px 10px',
            background: 'rgba(28,28,28,0.85)', color: '#fff',
            fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.18em', borderRadius: 999,
          }}>
            {hovered.es}
          </div>
        )}
      </div>
    </section>
  )
}
