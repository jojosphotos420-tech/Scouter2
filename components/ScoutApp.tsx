'use client'
import { useState, useCallback, useRef } from 'react'
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { PhotoSpot } from '@/lib/types'
import { useSpots } from '@/lib/useSpots'
import SpotsList from './SpotsList'
import SpotForm from './SpotForm'
import MapControls from './MapControls'
import StreetViewModal from './StreetViewModal'

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

const DARK_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#1a1814' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1814' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1e2218' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38352e' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212018' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
  { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d1117' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
  { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
]

interface PendingLocation { lat: number; lng: number }

export default function ScoutApp() {
  const { spots, loading, addSpot, updateSpot, deleteSpot } = useSpots()
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null)
  const [pendingLocation, setPendingLocation] = useState<PendingLocation | null>(null)
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [streetViewLocation, setStreetViewLocation] = useState<PendingLocation | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)

  const selectedSpot = spots.find(s => s.id === selectedSpotId) || null

  const handleMapClick = useCallback((e: any) => {
    const lat = e.detail?.latLng?.lat ?? e.latLng?.lat()
    const lng = e.detail?.latLng?.lng ?? e.latLng?.lng()
    if (lat == null || lng == null) return
    setPendingLocation({ lat, lng })
    setSelectedSpotId(null)
  }, [])

  const handleSaveSpot = useCallback(async (data: Omit<PhotoSpot, 'id' | 'createdAt'>) => {
    if (selectedSpotId) {
      await updateSpot(selectedSpotId, data)
      setSelectedSpotId(null)
    } else if (pendingLocation) {
      await addSpot(data)
      setPendingLocation(null)
    }
  }, [selectedSpotId, pendingLocation, addSpot, updateSpot])

  const handleDeleteSpot = useCallback(async () => {
    if (!selectedSpotId) return
    await deleteSpot(selectedSpotId)
    setSelectedSpotId(null)
  }, [selectedSpotId, deleteSpot])

  const handleSelectFromList = useCallback((spot: PhotoSpot) => {
    setSelectedSpotId(spot.id)
    setPendingLocation(null)
    if (mapRef.current) mapRef.current.panTo({ lat: spot.lat, lng: spot.lng })
  }, [])

  const handleCloseForm = () => {
    setSelectedSpotId(null)
    setPendingLocation(null)
  }

  const formOpen = !!pendingLocation || !!selectedSpotId
  const formLat = selectedSpot?.lat ?? pendingLocation?.lat ?? 0
  const formLng = selectedSpot?.lng ?? pendingLocation?.lng ?? 0

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#e8a020', letterSpacing: '0.1em' }}>LOADING SPOTS...</p>
    </div>
  )

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#0a0a0a' }}>

        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            position: 'absolute', top: 16,
            left: sidebarOpen ? 268 : 16,
            zIndex: 30,
            background: 'rgba(17,16,9,0.92)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'var(--font-display)', fontSize: '12px',
            letterSpacing: '0.1em', backdropFilter: 'blur(8px)',
            padding: '6px 12px', borderRadius: '6px', cursor: 'pointer',
            transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {sidebarOpen ? '◀ HIDE' : '▶ SPOTS'}
        </button>

        {/* Street View button */}
        <button
          onClick={() => {
            const center = mapRef.current?.getCenter()
            if (center) setStreetViewLocation({ lat: center.lat(), lng: center.lng() })
          }}
          style={{
            position: 'absolute', bottom: 140, right: 16, zIndex: 30,
            background: 'rgba(17,16,9,0.92)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#e8a020', fontFamily: 'var(--font-display)', fontSize: '11px',
            letterSpacing: '0.1em', backdropFilter: 'blur(8px)',
            padding: '8px 10px', borderRadius: '6px', cursor: 'pointer',
            width: 36, textAlign: 'center',
          }}
          title="Open Street View"
        >
          🚶
        </button>

        {/* Sidebar */}
        <div style={{
          width: sidebarOpen ? '260px' : '0px',
          minWidth: sidebarOpen ? '260px' : '0px',
          overflow: 'hidden',
          transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          flexShrink: 0, zIndex: 20,
        }}>
          {sidebarOpen && (
            <SpotsList spots={spots} selectedId={selectedSpotId} onSelect={handleSelectFromList} />
          )}
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <Map
            mapId="d379ce559424573757090374"
            defaultCenter={{ lat: 40.7580, lng: -73.9855 }}
            defaultZoom={14}
            gestureHandling="greedy"
            disableDefaultUI
            onClick={handleMapClick}
            styles={DARK_MAP_STYLES}
            onIdle={(e: any) => {
              const map = e.map
              if (map && !mapInstance) {
                setMapInstance(map)
                mapRef.current = map
              }
            }}
          >
            {spots.map(spot => (
              <AdvancedMarker
                key={spot.id}
                position={{ lat: spot.lat, lng: spot.lng }}
                onClick={() => {
                  setSelectedSpotId(spot.id)
                  setPendingLocation(null)
                }}
              >
                <div style={{
                  width: 28, height: 28,
                  borderRadius: '50% 50% 50% 0',
                  transform: 'rotate(-45deg)',
                  background: spot.id === selectedSpotId ? '#f5c842' : '#e8a020',
                  border: `2px solid ${spot.id === selectedSpotId ? '#fff' : 'rgba(255,255,255,0.6)'}`,
                  boxShadow: `0 4px 20px rgba(232,160,32,${spot.id === selectedSpotId ? '0.7' : '0.4'})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}>
                  <div style={{ transform: 'rotate(45deg)', fontSize: 10 }}>
                    {spot.photos?.length > 0 ? '📸' : '📍'}
                  </div>
                </div>
              </AdvancedMarker>
            ))}

            {pendingLocation && (
              <AdvancedMarker position={pendingLocation}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'rgba(232,160,32,0.2)',
                  border: '2px dashed #e8a020',
                }} />
              </AdvancedMarker>
            )}
          </Map>

          <MapControls map={mapInstance} />

          {spots.length === 0 && !formOpen && (
            <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
              <div style={{
                padding: '10px 16px', borderRadius: '99px',
                background: 'rgba(17,16,9,0.85)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                fontFamily: 'var(--font-body)', fontSize: '12px',
                color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', whiteSpace: 'nowrap',
              }}>
                Click anywhere on the map to scout a location
              </div>
            </div>
          )}
        </div>

        {/* Form panel */}
        <div style={{
          width: formOpen ? '300px' : '0px',
          minWidth: formOpen ? '300px' : '0px',
          overflow: 'hidden',
          transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          flexShrink: 0,
        }}>
          {formOpen && (
            <SpotForm
              key={selectedSpotId ?? `${formLat}-${formLng}`}
              lat={formLat} lng={formLng}
              existing={selectedSpot ?? undefined}
              onSave={handleSaveSpot}
              onDelete={selectedSpotId ? handleDeleteSpot : undefined}
              onClose={handleCloseForm}
            />
          )}
        </div>
      </div>

      {streetViewLocation && (
        <StreetViewModal
          lat={streetViewLocation.lat}
          lng={streetViewLocation.lng}
          onClose={() => setStreetViewLocation(null)}
        />
      )}
    </APIProvider>
  )
}
