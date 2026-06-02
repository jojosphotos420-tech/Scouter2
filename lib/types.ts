export type ShotAngle = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW'
export type BestTime = 'golden-hour-am' | 'golden-hour-pm' | 'blue-hour-am' | 'blue-hour-pm' | 'midday' | 'night' | 'overcast'

export interface PhotoSpot {
  id: string
  name: string
  lat: number
  lng: number
  notes: string
  shotAngle: ShotAngle
  bestTime: BestTime
  tags: string[]
  photos: string[]
  createdAt: number
}
