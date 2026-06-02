'use client'
import { PhotoSpot } from '@/lib/types'
import { MapPin, Search, Camera } from 'lucide-react'
import { useState } from 'react'

const TIME_ICONS: Record<string, string> = {
  'golden-hour-am': '🌅',
  'golden-hour-pm': '🌇',
  'blue-hour-am': '🌌',
  'blue-hour-pm': '🌆',
  'midday': '☀️',
  'night': '🌙',
  'overcast': '☁️',
}

interface Props {
  spots: PhotoSpot[]
  selectedId: string | null
  onSelect: (spot: PhotoSpot) => void
}

export default function SpotsList({ spots, selectedId, onSelect }: Props) {
  const [query, setQuery] = useState('')

  const filtered = spots.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.tags.some(t => t.includes(query.toLowerCase()))
  )

  return (
    <div className="slide-in flex flex-col h-full" style={{ background: '#0d0c0a', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <Camera size={16} color="#e8a020" />
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            color: '#f0ede8',
            letterSpacing: '0.06em',
          }}>
            PHOTO SPOT SCOUT
          </h1>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em' }}>
          {spots.length} LOCATION{spots.length !== 1 ? 'S' : ''} SAVED
        </p>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search size={13} color="rgba(255,255,255,0.25)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search spots or tags..."
            className="w-full pl-8 pr-3 py-2 rounded text-xs outline-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: '#f0ede8',
              fontFamily: 'var(--font-body)',
            }}
          />
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0 16px' }} />

      {/* List */}
      <div className="flex-1 overflow-y-auto py-2">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
            <MapPin size={24} color="rgba(255,255,255,0.1)" />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.2)', lineHeight: 1.6 }}>
              {spots.length === 0
                ? 'Click anywhere on the map to scout your first location'
                : 'No spots match your search'}
            </p>
          </div>
        )}
        {filtered.map((spot, i) => {
          const isSelected = spot.id === selectedId
          return (
            <button
              key={spot.id}
              onClick={() => onSelect(spot)}
              className="w-full text-left px-4 py-3 transition-all"
              style={{
                background: isSelected ? 'rgba(232,160,32,0.08)' : 'transparent',
                borderLeft: isSelected ? '2px solid #e8a020' : '2px solid transparent',
                animationDelay: `${i * 0.04}s`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: isSelected ? '#f0ede8' : 'rgba(255,255,255,0.7)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {spot.name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>
                    {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span style={{ fontSize: '14px' }}>{TIME_ICONS[spot.bestTime]}</span>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: isSelected ? '#e8a020' : 'rgba(255,255,255,0.25)',
                    letterSpacing: '0.05em',
                  }}>
                    {spot.shotAngle}
                  </span>
                </div>
              </div>
              {spot.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {spot.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '9px',
                      color: 'rgba(255,255,255,0.25)',
                      background: 'rgba(255,255,255,0.04)',
                      padding: '1px 6px',
                      borderRadius: '99px',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.18)', textAlign: 'center', letterSpacing: '0.06em' }}>
          CLICK MAP TO ADD · CLICK PIN TO EDIT
        </p>
      </div>
    </div>
  )
}
