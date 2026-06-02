'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'
import { PhotoSpot } from './types'

function dbToSpot(row: any): PhotoSpot {
  return {
    id: row.id,
    name: row.name,
    lat: row.lat,
    lng: row.lng,
    notes: row.notes ?? '',
    shotAngle: row.shot_angle,
    bestTime: row.best_time,
    tags: row.tags ?? [],
    photos: row.photos ?? [],
    createdAt: row.created_at,
  }
}

function spotToDb(spot: Omit<PhotoSpot, 'id' | 'createdAt'>) {
  return {
    name: spot.name,
    lat: spot.lat,
    lng: spot.lng,
    notes: spot.notes,
    shot_angle: spot.shotAngle,
    best_time: spot.bestTime,
    tags: spot.tags,
    photos: spot.photos,
  }
}

export function useSpots() {
  const [spots, setSpots] = useState<PhotoSpot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('spots').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        console.log('fetch spots', data, error)
        if (data) setSpots(data.map(dbToSpot))
        setLoading(false)
      })
  }, [])

  const addSpot = useCallback(async (data: Omit<PhotoSpot, 'id' | 'createdAt'>) => {
    console.log('adding spot', data)
    const payload = spotToDb(data)
    console.log('payload', payload)
    const { data: row, error } = await supabase.from('spots').insert(payload).select().single()
    console.log('result', row, error)
    if (row) setSpots(prev => [dbToSpot(row), ...prev])
    return row ? dbToSpot(row) : null
  }, [])

  const updateSpot = useCallback(async (id: string, data: Omit<PhotoSpot, 'id' | 'createdAt'>) => {
    const { data: row, error } = await supabase.from('spots').update(spotToDb(data)).eq('id', id).select().single()
    console.log('update result', row, error)
    if (row) setSpots(prev => prev.map(s => s.id === id ? dbToSpot(row) : s))
  }, [])

  const deleteSpot = useCallback(async (id: string) => {
    await supabase.from('spots').delete().eq('id', id)
    setSpots(prev => prev.filter(s => s.id !== id))
  }, [])

  return { spots, loading, addSpot, updateSpot, deleteSpot }
}
