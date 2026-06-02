'use client'
import { useState, useRef } from 'react'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { Camera, X, Loader } from 'lucide-react'

interface Props {
  photos: string[]
  onChange: (photos: string[]) => void
}

export default function PhotoUploader({ photos, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const uploads = await Promise.all(Array.from(files).map(uploadToCloudinary))
      onChange([...photos, ...uploads])
    } catch (e) {
      console.error('Upload error', e)
    }
    setUploading(false)
  }

  const removePhoto = (url: string) => {
    onChange(photos.filter(p => p !== url))
  }

  return (
    <div>
      <label className="block mb-2 text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}>
        Photos
      </label>

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5 mb-2">
          {photos.map((url, i) => (
            <div key={i} className="relative group" style={{ aspectRatio: '1', borderRadius: 4, overflow: 'hidden' }}>
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                onClick={() => removePhoto(url)}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(0,0,0,0.6)' }}
              >
                <X size={16} color="white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded transition-all"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px dashed rgba(255,255,255,0.12)',
          color: uploading ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)',
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          cursor: uploading ? 'not-allowed' : 'pointer',
        }}
      >
        {uploading ? (
          <><Loader size={13} className="animate-spin" /> Uploading...</>
        ) : (
          <><Camera size={13} /> Add Photos</>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  )
}
