'use client'
import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface Props {
  lat: number
  lng: number
  onClose: () => void
}

export default function StreetViewModal({ lat, lng, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || !window.google) return

    const panorama = new window.google.maps.StreetViewPanorama(ref.current, {
      position: { lat, lng },
      pov: { heading: 0, pitch: 0 },
      zoom: 1,
      addressControl: false,
      fullscreenControl: false,
      motionTrackingControl: false,
      showRoadLabels: false,
    })

    return () => {
      // cleanup
    }
  }, [lat, lng])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: '90vw', height: '80vh', maxWidth: 1100,
        borderRadius: 8, overflow: 'hidden', position: 'relative',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 0 80px rgba(0,0,0,0.8)',
      }}>
        {/* Header */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
          padding: '12px 16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 16,
            color: '#f0ede8', letterSpacing: '0.08em',
          }}>
            STREET VIEW · {lat.toFixed(5)}, {lng.toFixed(5)}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 6, padding: '6px 8px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)', fontSize: 12,
            }}
          >
            <X size={14} /> CLOSE
          </button>
        </div>

        {/* Street View container */}
        <div ref={ref} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  )
}
