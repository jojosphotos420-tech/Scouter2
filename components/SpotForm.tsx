'use client'
import { useState } from 'react'
import { PhotoSpot, ShotAngle, BestTime } from '@/lib/types'
import CompassPicker from './CompassPicker'
import PhotoUploader from './PhotoUploader'
import { X, MapPin, Clock, Tag, FileText } from 'lucide-react'

const BEST_TIMES: { value: BestTime; label: string; icon: string }[] = [
  { value: 'golden-hour-am', label: 'Golden AM', icon: '🌅' },
  { value: 'golden-hour-pm', label: 'Golden PM', icon: '🌇' },
  { value: 'blue-hour-am', label: 'Blue AM', icon: '🌌' },
  { value: 'blue-hour-pm', label: 'Blue PM', icon: '🌆' },
  { value: 'midday', label: 'Midday', icon: '☀️' },
  { value: 'night', label: 'Night', icon: '🌙' },
  { value: 'overcast', label: 'Overcast', icon: '☁️' },
]

interface Props {
  lat: number
  lng: number
  existing?: PhotoSpot
  onSave: (spot: Omit<PhotoSpot, 'id' | 'createdAt'>) => void
  onDelete?: () => void
  onClose: () => void
}

export default function SpotForm({ lat, lng, existing, onSave, onDelete, onClose }: Props) {
  const [name, setName] = useState(existing?.name ?? '')
  const [notes, setNotes] = useState(existing?.notes ?? '')
  const [shotAngle, setShotAngle] = useState<ShotAngle>(existing?.shotAngle ?? 'N')
  const [bestTime, setBestTime] = useState<BestTime>(existing?.bestTime ?? 'golden-hour-am')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(existing?.tags ?? [])
  const [photos, setPhotos] = useState<string[]>(existing?.photos ?? [])
  const [saving, setSaving] = useState(false)

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags(t => Array.from(new Set([...t, tagInput.trim().toLowerCase()])))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => setTags(t => t.filter(x => x !== tag))

  const handleSubmit = async () => {
    if (!name.trim()) return
    setSaving(true)
    await onSave({ name: name.trim(), lat, lng, notes, shotAngle, bestTime, tags, photos })
    setSaving(false)
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#f0ede8',
    fontFamily: 'var(--font-body)',
  }

  return (
    <div className="slide-in-right flex flex-col h-full" style={{ background: '#111009', borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <MapPin size={14} color="#e8a020" />
            <span className="text-xs" style={{ color: '#e8a020', fontFamily: 'var(--font-body)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {existing ? 'Edit Spot' : 'New Spot'}
            </span>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}>
            {lat.toFixed(5)}, {lng.toFixed(5)}
          </p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded transition-colors hover:bg-white/5">
          <X size={16} color="rgba(255,255,255,0.4)" />
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">

        {/* Name */}
        <div>
          <label className="block mb-1.5 text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}>
            Location Name
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Rooftop on Main St..."
            className="w-full px-3 py-2.5 rounded text-sm outline-none"
            style={inputStyle}
          />
        </div>

        {/* Shot Angle */}
        <div>
          <label className="block mb-3 text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}>
            Shot Angle
          </label>
          <div className="flex justify-center">
            <CompassPicker value={shotAngle} onChange={setShotAngle} />
          </div>
        </div>

        {/* Best Time */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={12} color="rgba(255,255,255,0.3)" />
            <label className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}>
              Best Time
            </label>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {BEST_TIMES.map(t => (
              <button
                key={t.value}
                onClick={() => setBestTime(t.value)}
                className="flex items-center gap-2 px-3 py-2 rounded text-left transition-all"
                style={{
                  background: bestTime === t.value ? 'rgba(232,160,32,0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${bestTime === t.value ? 'rgba(232,160,32,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  color: bestTime === t.value ? '#e8a020' : 'rgba(255,255,255,0.45)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                }}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Photos */}
        <PhotoUploader photos={photos} onChange={setPhotos} />

        {/* Notes */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <FileText size={12} color="rgba(255,255,255,0.3)" />
            <label className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}>
              Notes
            </label>
          </div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Parking on side street, tripod recommended..."
            rows={3}
            className="w-full px-3 py-2.5 rounded text-sm outline-none resize-none"
            style={inputStyle}
          />
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Tag size={12} color="rgba(255,255,255,0.3)" />
            <label className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}>
              Tags
            </label>
          </div>
          <input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Press Enter to add (urban, rooftop...)"
            className="w-full px-3 py-2.5 rounded text-sm outline-none"
            style={inputStyle}
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  onClick={() => removeTag(tag)}
                  className="px-2 py-0.5 rounded-full text-xs cursor-pointer"
                  style={{
                    background: 'rgba(232,160,32,0.08)',
                    border: '1px solid rgba(232,160,32,0.2)',
                    color: '#e8a020',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  #{tag} ×
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-3 flex flex-col gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || saving}
          className="w-full py-3 rounded font-medium text-sm transition-all"
          style={{
            background: name.trim() && !saving ? '#e8a020' : 'rgba(255,255,255,0.05)',
            color: name.trim() && !saving ? '#0a0a0a' : 'rgba(255,255,255,0.2)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.08em',
            fontSize: '14px',
            cursor: name.trim() && !saving ? 'pointer' : 'not-allowed',
          }}
        >
          {saving ? 'SAVING...' : existing ? 'UPDATE SPOT' : 'SAVE SPOT'}
        </button>
        {existing && onDelete && (
          <button
            onClick={onDelete}
            className="w-full py-2 rounded text-sm transition-all hover:bg-red-500/10"
            style={{
              color: 'rgba(255,80,80,0.6)',
              fontFamily: 'var(--font-body)',
              border: '1px solid rgba(255,80,80,0.12)',
            }}
          >
            Delete spot
          </button>
        )}
      </div>
    </div>
  )
}
