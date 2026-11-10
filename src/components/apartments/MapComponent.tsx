'use client'
import { useEffect, useRef, useState } from 'react'
import { formatApartmentPrice } from '@/lib/apartments-api'
interface Apartment { id: string; title: string; price: number; priceType?: 'rent' | 'purchase' | 'unknown'; pricePeriod?: 'day' | 'week' | 'month' | null; priceLabel?: string; lat: number; lng: number; hasMapLocation?: boolean }
interface MapComponentProps { apartments: Apartment[]; center?: [number, number]; zoom?: number; selectedId?: string | null; onSelectApartment?: (id: string) => void }
// Google Maps is loaded only in the browser from the deployment's restricted public key.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GoogleAny = any
declare global { interface Window { google?: GoogleAny; gm_authFailure?: () => void } }
let googleMapsPromise: Promise<void> | null = null
const defaultCenter: [number, number] = [51.2277, 6.7735]
function loadGoogleMaps(apiKey: string) {
  if (window.google?.maps) return Promise.resolve()
  if (googleMapsPromise) return googleMapsPromise
  googleMapsPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(apiKey) + '&language=de&region=DE&v=weekly'
    script.async = true
    script.onload = () => window.google?.maps ? resolve() : reject(new Error('Map unavailable'))
    script.onerror = () => { script.remove(); reject(new Error('Map unavailable')) }
    document.head.appendChild(script)
  }).catch(error => { googleMapsPromise = null; throw error })
  return googleMapsPromise
}
export default function MapComponent({ apartments, center = defaultCenter, zoom = 13, selectedId, onSelectApartment }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<GoogleAny>(null)
  const markers = useRef<GoogleAny[]>([])
  const onSelect = useRef(onSelectApartment); onSelect.current = onSelectApartment
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const lat = Number.isFinite(center[0]) ? center[0] : defaultCenter[0]
  const lng = Number.isFinite(center[1]) ? center[1] : defaultCenter[1]
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) { setError('Die Karte ist derzeit nicht verfügbar. Alle Immobilien finden Sie in der Liste.'); return }
    let active = true
    const previousAuthFailure = window.gm_authFailure
    const authFailure = () => { if (active) setError('Die Karte ist derzeit nicht verfügbar. Bitte verwenden Sie die Immobilienliste.'); previousAuthFailure?.() }
    window.gm_authFailure = authFailure
    loadGoogleMaps(apiKey).then(() => {
      if (!active || !mapRef.current) return
      mapInstance.current = new window.google.maps.Map(mapRef.current, { center: { lat, lng }, zoom, mapTypeControl: false, streetViewControl: false, fullscreenControl: true, clickableIcons: false, gestureHandling: 'cooperative' })
      setReady(true)
    }).catch(() => { if (active) setError('Die Karte konnte nicht geladen werden. Bitte verwenden Sie die Immobilienliste.') })
    return () => { active = false; if (window.gm_authFailure === authFailure) window.gm_authFailure = previousAuthFailure }
  }, [lat, lng, zoom])
  useEffect(() => {
    const map = mapInstance.current
    if (!ready || !map || !window.google?.maps) return
    markers.current.forEach(marker => { window.google.maps.event.clearInstanceListeners(marker); marker.setMap(null) }); markers.current = []
    const bounds = new window.google.maps.LatLngBounds()
    const valid = apartments.filter(apartment => apartment.hasMapLocation === true && Number.isFinite(apartment.lat) && Number.isFinite(apartment.lng) && Math.abs(apartment.lat) <= 90 && Math.abs(apartment.lng) <= 180 && !(apartment.lat === 0 && apartment.lng === 0))
    valid.forEach(apartment => {
      const price=formatApartmentPrice({ price: apartment.price, priceType: apartment.priceType || 'unknown', pricePeriod: apartment.pricePeriod || null }).replace(' / Monat','')
      const marker = new window.google.maps.Marker({ map, position: { lat: apartment.lat, lng: apartment.lng }, title: apartment.title + ' · ' + price, label:{text:price,color:'#262626',fontSize:'11px',fontWeight:'700'}, icon:{path:window.google.maps.SymbolPath.CIRCLE,scale:18,fillColor:'#d1c9be',fillOpacity:1,strokeColor:'#ffffff',strokeWeight:3} })
      marker.apartmentId = apartment.id
      marker.addListener('click', () => onSelect.current?.(apartment.id))
      markers.current.push(marker); bounds.extend(marker.getPosition())
    })
    if (valid.length > 1) map.fitBounds(bounds, 48)
    else if (valid.length === 1) { map.setCenter({ lat: valid[0].lat, lng: valid[0].lng }); map.setZoom(zoom) }
    return () => { markers.current.forEach(marker => { window.google?.maps.event.clearInstanceListeners(marker); marker.setMap(null) }); markers.current = [] }
  }, [apartments, ready, zoom])
  useEffect(() => {
    if (!ready || !window.google?.maps) return
    markers.current.forEach(marker => {
      const selected = marker.apartmentId === selectedId
      marker.setIcon({ path: window.google.maps.SymbolPath.CIRCLE, scale: selected ? 21 : 18, fillColor: selected ? '#b5aa9a' : '#d1c9be', fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 3 })
      marker.setZIndex(selected ? 1000 : 1)
      if (selected) mapInstance.current?.panTo(marker.getPosition())
    })
  }, [apartments, ready, selectedId])
  return <div className="relative h-full w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-100"><div ref={mapRef} className="h-full w-full" aria-label="Interaktive Immobilienkarte" />{error && <div role="status" className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-[#6f7470]">{error}</div>}{!error && ready && !apartments.some(apartment => apartment.hasMapLocation) && <p className="absolute inset-x-4 top-4 rounded-lg bg-white p-4 text-sm shadow">Für diese Auswahl sind keine Kartenpositionen veröffentlicht.</p>}</div>
}

