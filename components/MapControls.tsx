'use client'
import { Compass, Mountain, Minus, Plus, RotateCcw } from 'lucide-react'

interface Props {
  map: google.maps.Map | null
}

export default function MapControls({ map }: Props) {
  const tilt = (delta: number) => {
    if (!map) return
    const current = map.getTilt() || 0
    map.setTilt(Math.max(0, Math.min(67.5, current + delta)))
  }

  const rotate = (delta: number) => {
    if (!map) return
    const current = map.getHeading() || 0
    map.setHeading((current + delta + 360) % 360)
  }

  const resetView = () => {
    if (!map) return
    map.setTilt(0)
    map.setHeading(0)
  }

  const zoom = (delta: number) => {
    if (!map) return
    const current = map.getZoom() || 14
    map.setZoom(current + delta)
  }

  const btnStyle = {
    background: 'rgba(17,16,9,0.92)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.6)',
    borderRadius: '6px',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    backdropFilter: 'blur(8px)',
  }

  const labelStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: '8px',
    color: 'rgba(255,255,255,0.2)',
    textAlign: 'center' as const,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  }

  return (
    <div className="absolute right-4 bottom-8 flex flex-col gap-3">
      {/* Zoom */}
      <div className="flex flex-col items-center gap-1">
        <p style={labelStyle}>ZOOM</p>
        <div className="flex flex-col gap-1">
          <button style={btnStyle} onClick={() => zoom(1)}><Plus size={14} /></button>
          <button style={btnStyle} onClick={() => zoom(-1)}><Minus size={14} /></button>
        </div>
      </div>

      {/* Tilt */}
      <div className="flex flex-col items-center gap-1">
        <p style={labelStyle}>TILT</p>
        <div className="flex flex-col gap-1">
          <button style={btnStyle} onClick={() => tilt(15)} title="Increase tilt">
            <Mountain size={14} />
          </button>
          <button style={btnStyle} onClick={() => tilt(-15)} title="Decrease tilt">
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>—</span>
          </button>
        </div>
      </div>

      {/* Rotate */}
      <div className="flex flex-col items-center gap-1">
        <p style={labelStyle}>ROTATE</p>
        <div className="flex flex-col gap-1">
          <button style={btnStyle} onClick={() => rotate(-45)} title="Rotate left">
            <RotateCcw size={14} />
          </button>
          <button style={btnStyle} onClick={() => rotate(45)} title="Rotate right">
            <Compass size={14} />
          </button>
        </div>
      </div>

      {/* Reset */}
      <button
        style={{ ...btnStyle, width: 36 }}
        onClick={resetView}
        title="Reset view"
      >
        <span style={{ fontSize: '9px', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', color: '#e8a020' }}>RST</span>
      </button>
    </div>
  )
}
