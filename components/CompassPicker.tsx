'use client'
import { ShotAngle } from '@/lib/types'

const ANGLES: ShotAngle[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
const ANGLE_DEG: Record<ShotAngle, number> = {
  N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315
}

interface Props {
  value: ShotAngle
  onChange: (a: ShotAngle) => void
}

export default function CompassPicker({ value, onChange }: Props) {
  const size = 120
  const cx = size / 2
  const r = 44

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle cx={cx} cy={cx} r={r + 6} fill="#111" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        
        {/* Tick marks */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10 * Math.PI) / 180
          const inner = i % 9 === 0 ? r - 8 : r - 4
          return (
            <line
              key={i}
              x1={cx + inner * Math.sin(angle)}
              y1={cx - inner * Math.cos(angle)}
              x2={cx + r * Math.sin(angle)}
              y2={cx - r * Math.cos(angle)}
              stroke={i % 9 === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}
              strokeWidth={i % 9 === 0 ? 1.5 : 0.75}
            />
          )
        })}

        {/* Direction buttons */}
        {ANGLES.map((dir) => {
          const deg = ANGLE_DEG[dir]
          const rad = (deg * Math.PI) / 180
          const btnR = r - 14
          const x = cx + btnR * Math.sin(rad)
          const y = cx - btnR * Math.cos(rad)
          const isSelected = value === dir
          const isCardinal = ['N', 'E', 'S', 'W'].includes(dir)

          return (
            <g key={dir} onClick={() => onChange(dir)} style={{ cursor: 'pointer' }}>
              <circle
                cx={x} cy={y} r={isCardinal ? 10 : 8}
                fill={isSelected ? '#e8a020' : 'rgba(255,255,255,0.04)'}
                stroke={isSelected ? '#f5c842' : 'rgba(255,255,255,0.12)'}
                strokeWidth="1"
                style={{ transition: 'all 0.15s ease' }}
              />
              <text
                x={x} y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isCardinal ? '7' : '5.5'}
                fontFamily="var(--font-body)"
                fontWeight="500"
                fill={isSelected ? '#0a0a0a' : 'rgba(255,255,255,0.5)'}
              >
                {dir}
              </text>
            </g>
          )
        })}

        {/* Center dot */}
        <circle cx={cx} cy={cx} r={3} fill="#e8a020" />
        
        {/* Pointer line */}
        <line
          x1={cx}
          y1={cx}
          x2={cx + (r - 22) * Math.sin((ANGLE_DEG[value] * Math.PI) / 180)}
          y2={cx - (r - 22) * Math.cos((ANGLE_DEG[value] * Math.PI) / 180)}
          stroke="#e8a020"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ transition: 'all 0.2s ease' }}
        />
      </svg>
      <span className="text-xs font-body" style={{ color: '#e8a020', letterSpacing: '0.1em' }}>
        {value} · {ANGLE_DEG[value]}°
      </span>
    </div>
  )
}
