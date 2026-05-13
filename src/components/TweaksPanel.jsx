import { useState, useRef, useCallback } from 'react'

export function useTweaks(defaults) {
  const [values, setValues] = useState(defaults)
  const setTweak = useCallback((keyOrEdits, val) => {
    const edits =
      typeof keyOrEdits === 'object' && keyOrEdits !== null
        ? keyOrEdits
        : { [keyOrEdits]: val }
    setValues(prev => ({ ...prev, ...edits }))
  }, [])
  return [values, setTweak]
}

export function TweaksPanel({ title = 'Tweaks', children }) {
  const [open, setOpen] = useState(false)
  const dragRef = useRef(null)
  const offsetRef = useRef({ x: 16, y: 16 })

  const clamp = useCallback(() => {
    const panel = dragRef.current
    if (!panel) return
    const w = panel.offsetWidth, h = panel.offsetHeight
    offsetRef.current = {
      x: Math.min(Math.max(16, offsetRef.current.x), window.innerWidth - w - 16),
      y: Math.min(Math.max(16, offsetRef.current.y), window.innerHeight - h - 16),
    }
    panel.style.right  = offsetRef.current.x + 'px'
    panel.style.bottom = offsetRef.current.y + 'px'
  }, [])

  const onDragStart = (e) => {
    const panel = dragRef.current
    if (!panel) return
    const r = panel.getBoundingClientRect()
    const sx = e.clientX, sy = e.clientY
    const startRight  = window.innerWidth  - r.right
    const startBottom = window.innerHeight - r.bottom
    const move = (ev) => {
      offsetRef.current = { x: startRight - (ev.clientX - sx), y: startBottom - (ev.clientY - sy) }
      clamp()
    }
    const up = () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', right: 16, bottom: 16, zIndex: 2147483646,
          background: 'rgba(250,249,247,.92)', border: '.5px solid rgba(0,0,0,.12)',
          borderRadius: 10, padding: '8px 14px', cursor: 'default',
          font: '600 11px/1 ui-sans-serif, system-ui, sans-serif',
          color: '#29261b', boxShadow: '0 4px 16px rgba(0,0,0,.12)',
          backdropFilter: 'blur(12px)',
        }}
      >
        Tweaks ⚙
      </button>
    )
  }

  return (
    <div
      ref={dragRef}
      className="twk-panel"
      style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}
    >
      <div className="twk-hd" onMouseDown={onDragStart}>
        <b>{title}</b>
        <button className="twk-x" onMouseDown={e => e.stopPropagation()} onClick={() => setOpen(false)}>✕</button>
      </div>
      <div className="twk-body">{children}</div>
    </div>
  )
}

export function TweakSection({ label }) {
  return <div className="twk-sect">{label}</div>
}

export function TweakToggle({ label, value, onChange }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button
        type="button" className="twk-toggle"
        data-on={value ? '1' : '0'}
        role="switch" aria-checked={!!value}
        onClick={() => onChange(!value)}
      >
        <i />
      </button>
    </div>
  )
}

export function TweakRadio({ label, value, options, onChange }) {
  const trackRef = useRef(null)
  const valueRef = useRef(value)
  valueRef.current = value

  const opts = options.map(o => typeof o === 'object' ? o : { value: o, label: o })
  const idx = Math.max(0, opts.findIndex(o => o.value === value))
  const n = opts.length

  const segAt = (clientX) => {
    const r = trackRef.current.getBoundingClientRect()
    const i = Math.floor(((clientX - r.left - 2) / (r.width - 4)) * n)
    return opts[Math.max(0, Math.min(n - 1, i))].value
  }

  const onPointerDown = (e) => {
    const v0 = segAt(e.clientX)
    if (v0 !== valueRef.current) onChange(v0)
    const move = (ev) => { const v = segAt(ev.clientX); if (v !== valueRef.current) onChange(v) }
    const up   = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  return (
    <div className="twk-row">
      <div className="twk-lbl"><span>{label}</span></div>
      <div ref={trackRef} role="radiogroup" onPointerDown={onPointerDown} className="twk-seg">
        <div
          className="twk-seg-thumb"
          style={{ left: `calc(2px + ${idx} * (100% - 4px) / ${n})`, width: `calc((100% - 4px) / ${n})` }}
        />
        {opts.map(o => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function isLight(hex) {
  const h = String(hex).replace('#', '')
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0')
  const n = parseInt(x.slice(0, 6), 16)
  if (Number.isNaN(n)) return true
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  return r * 299 + g * 587 + b * 114 > 148000
}

export function TweakColor({ label, value, options, onChange }) {
  const key = o => String(JSON.stringify(o)).toLowerCase()
  const cur = key(value)
  return (
    <div className="twk-row">
      <div className="twk-lbl"><span>{label}</span></div>
      <div className="twk-chips" role="radiogroup">
        {options.map((o, i) => {
          const color = Array.isArray(o) ? o[0] : o
          const on = key(o) === cur
          return (
            <button
              key={i} type="button" className="twk-chip"
              role="radio" aria-checked={on} data-on={on ? '1' : '0'}
              style={{ background: color }}
              onClick={() => onChange(o)}
            >
              {on && (
                <svg viewBox="0 0 14 14" aria-hidden="true">
                  <path
                    d="M3 7.2 5.8 10 11 4.2" fill="none" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round"
                    stroke={isLight(color) ? 'rgba(0,0,0,.78)' : '#fff'}
                  />
                </svg>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
