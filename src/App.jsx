import { useState, useEffect } from 'react'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import {
  useTweaks, TweaksPanel, TweakSection,
  TweakToggle, TweakRadio, TweakColor,
} from './components/TweaksPanel'

const DEFAULTS = {
  accent:      '#5944ff',
  manifestoBg: 'blobs',
  showCards:   true,
  cursorMode:  'star',
}

function accentFg(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return 0.299 * r + 0.587 * g + 0.114 * b > 165 ? '#1c1c1c' : '#ffffff'
}

function CursorStar({ mode }) {
  const [pos, setPos]   = useState({ x: -100, y: -100 })
  const [hover, setHover] = useState(false)

  useEffect(() => {
    const move = e => {
      setPos({ x: e.clientX, y: e.clientY })
      setHover(!!e.target.closest('a, button, .word, .tenet'))
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  useEffect(() => {
    document.body.style.cursor = mode === 'off' ? 'auto' : 'none'
  }, [mode])

  if (mode === 'off') return null

  return (
    <div
      className={`cnp-cursor ${hover ? 'is-hover' : ''}`}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)` }}
      aria-hidden="true"
    >
      {mode === 'star'
        ? <svg viewBox="0 0 100 100"><path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" /></svg>
        : <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" /></svg>
      }
    </div>
  )
}

export default function App() {
  const [t, setTweak] = useTweaks(DEFAULTS)

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accent)
    document.documentElement.style.setProperty('--accent-fg', accentFg(t.accent))
  }, [t.accent])

  return (
    <>
      <CursorStar mode={t.cursorMode} />
      <Hero showCards={t.showCards} />
      <Manifesto bgStyle={t.manifestoBg} />


    </>
  )
}
