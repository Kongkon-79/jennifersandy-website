'use client'
import { useDeferredValue, useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { Columns3, LayoutList, Map as MapIcon, SlidersHorizontal } from 'lucide-react'
import { fetchApartments, formatApartmentPrice } from '@/lib/apartments-api'
const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false, loading: () => <div className="h-full animate-pulse rounded-xl bg-stone-100" /> })
type InitialFilters = { searchTerm?: string; district?: string; rooms?: string; availableFrom?: string }
export function ApartmentsPageContent({ initialFilters = {}, homeMapOnly = false }: { initialFilters?: InitialFilters; homeMapOnly?: boolean }) {
  const [search, setSearch] = useState(initialFilters.searchTerm || '')
  const [district, setDistrict] = useState(initialFilters.district || '')
  const [rooms, setRooms] = useState(initialFilters.rooms?.replace('+', '') || '')
  const [date, setDate] = useState(initialFilters.availableFrom || '')
  const [maxPrice, setMaxPrice] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'split' | 'list' | 'map'>('split')
  const listRef = useRef<HTMLDivElement>(null)
  const deferredSearch = useDeferredValue(search.trim())
  const [searchTerm,setSearchTerm]=useState(deferredSearch)
  useEffect(()=>{const timer=window.setTimeout(()=>setSearchTerm(deferredSearch),350);return()=>window.clearTimeout(timer)},[deferredSearch])
  const filters = { searchTerm, district: district.trim(), minRooms: rooms ? Number(rooms) : undefined, maxPrice: maxPrice ? Number(maxPrice) : undefined, availableFrom: date, vermarktungsart: 'miete' as const, limit: 1000 }
  const { data, isLoading, isFetching, isError, refetch } = useQuery({ queryKey: ['apartment-search', filters], queryFn: () => fetchApartments(filters), staleTime: 30_000, placeholderData: previous=>previous })
  const apartments = data?.apartments || []
  useEffect(() => { setSelectedId(null) }, [searchTerm, district, rooms, date, maxPrice])
  const select = (id: string) => { setSelectedId(id); Array.from(listRef.current?.querySelectorAll<HTMLElement>('[data-apartment-id]') || []).find(card => card.dataset.apartmentId === id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) }
  const inputClass = 'mt-2 h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-[#262626]'
  const filterFields = <>
    <label className="text-sm">Suchbegriff<input type="search" value={search} onChange={event => setSearch(event.target.value)} className={inputClass} placeholder="Ort, Titel oder Beschreibung" /></label>
    <label className="text-sm">Stadtteil<input value={district} onChange={event => setDistrict(event.target.value)} className={inputClass} placeholder="z. B. Bilk" /></label>
    <label className="text-sm">Zimmer ab<input type="number" min="0" step="0.5" value={rooms} onChange={event => setRooms(event.target.value)} className={inputClass} /></label>
    <label className="text-sm">Preis bis (€)<input type="number" min="0" step="50" value={maxPrice} onChange={event => setMaxPrice(event.target.value)} className={inputClass} /></label>
    <label className="text-sm">Einzug am<input type="date" value={date} onChange={event => setDate(event.target.value)} className={inputClass} /></label>
    <button type="button" className="text-left text-sm underline underline-offset-4" onClick={() => { setSearch(''); setDistrict(''); setRooms(''); setDate(''); setMaxPrice('') }}>Filter zurücksetzen</button>
  </>
  return <section className="container px-4 py-8 sm:px-6 lg:px-10" id="wohnungen" aria-labelledby="listing-heading">
    {!homeMapOnly && <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h1 id="listing-heading" className="section-title">Immobilien finden</h1><p className="mt-2 text-sm text-[#6f7470]">Möblierte Apartments in Düsseldorf und Umgebung.</p></div><div className="flex items-center gap-3"><p aria-live="polite" className="text-sm">{isFetching ? 'Immobilien werden geladen …' : String(data?.meta?.total ?? apartments.length) + ' Immobilien'}</p><div className="flex rounded-lg border border-stone-200 bg-white p-1" aria-label="Ansicht wählen">
      {([{ id: 'split', label: 'Liste & Karte', icon: Columns3 }, { id: 'list', label: 'Listenansicht', icon: LayoutList }, { id: 'map', label: 'Kartenansicht', icon: MapIcon }] as const).map(option => <button key={option.id} type="button" onClick={() => setViewMode(option.id)} title={option.label} aria-label={option.label} aria-pressed={viewMode === option.id} className={'rounded-md p-2 transition-colors ' + (viewMode === option.id ? 'bg-[#d1c9be] text-[#262626]' : 'text-[#6f7470] hover:bg-stone-100')}><option.icon className="h-4 w-4" /></button>)}
    </div></div></div>}
    {!homeMapOnly && <details className="mb-6 rounded-lg border border-stone-200 bg-white"><summary className="flex cursor-pointer list-none items-center gap-2 p-4 text-sm font-semibold"><SlidersHorizontal className="h-4 w-4" /> Suche & Filter <span className="ml-auto text-xs font-normal">Öffnen / schließen</span></summary><div className="grid gap-4 border-t border-stone-100 p-4 sm:grid-cols-2 lg:grid-cols-3">{filterFields}</div></details>}
    {isError ? <div role="alert" className="rounded-xl border border-stone-200 p-8"><p>Die Immobilien konnten nicht geladen werden. Bitte versuchen Sie es erneut.</p><button className="brand-button mt-4" onClick={() => refetch()}>Erneut versuchen</button></div> : <div className={(homeMapOnly || viewMode === 'split') ? 'grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]' : 'grid items-start gap-6'}>
      <div ref={listRef} aria-busy={isFetching} className={(viewMode === 'map' ? 'hidden' : viewMode === 'list' ? 'grid gap-5 md:grid-cols-2 xl:grid-cols-3' : 'space-y-3 lg:max-h-[680px] lg:overflow-y-auto lg:pr-2')}>
        {isLoading ? <p role="status" className="rounded-lg bg-stone-50 p-8">Veröffentlichte Immobilien werden geladen …</p> : !apartments.length ? <p role="status" className="rounded-lg bg-stone-50 p-8">Keine Immobilien für diese Auswahl gefunden. Bitte passen Sie die Filter an.</p> : apartments.map(apartment => <article key={apartment.id} data-apartment-id={apartment.id} className={'scroll-m-4 overflow-hidden rounded-xl border-2 bg-white transition-colors ' + (selectedId === apartment.id ? 'border-[#9f9587] shadow-md' : 'border-stone-200')}>
          <button type="button" aria-pressed={selectedId === apartment.id} onClick={() => select(apartment.id)} className="grid w-full gap-4 p-3 text-left sm:grid-cols-[140px_1fr]">
            <div className="relative h-44 overflow-hidden rounded-md bg-stone-100 sm:h-full sm:min-h-40"><Image src={apartment.image} alt={apartment.title} fill sizes="(max-width:640px) 100vw, 150px" className="object-cover" /></div><div><h2 className="text-base font-semibold leading-6">{apartment.title}</h2><p className="mt-1 text-xs text-[#6f7470]">{[apartment.district, apartment.city !== apartment.district ? apartment.city : ''].filter(Boolean).join(' · ')}</p><p className="mt-3 text-sm">{[apartment.size ? String(apartment.size) + ' m²' : '', apartment.rooms ? String(apartment.rooms) + ' Zimmer' : ''].filter(Boolean).join(' · ')}</p><p className="mt-3 font-semibold">{formatApartmentPrice(apartment)}</p><p className="text-xs text-[#6f7470]">{apartment.priceLabel}</p><p className="mt-2 text-xs">{apartment.availableFrom}</p>{apartment.rentalStatus && <p className="mt-1 text-xs font-medium">{apartment.rentalStatus}</p>}{!apartment.hasMapLocation && <p className="mt-1 text-xs text-[#6f7470]">Kartenposition nicht veröffentlicht</p>}</div>
          </button><div className="border-t border-stone-100 px-4 py-2 text-right"><Link href={'/apartments/' + encodeURIComponent(apartment.id)} className="text-sm font-semibold underline underline-offset-4">Details & Bilder</Link></div>
        </article>)}
      </div>{(homeMapOnly || viewMode === 'split' || viewMode === 'map') && <div className="lg:sticky lg:top-24"><div className="h-[70vh] min-h-[480px] lg:h-[680px]"><MapComponent apartments={apartments} selectedId={selectedId} onSelectApartment={select} /></div><p className="mt-2 text-xs leading-5 text-[#6f7470]">Liste und Karte zeigen dieselbe Auswahl. Kartenpositionen erscheinen nur bei veröffentlichten Standortdaten.</p></div>}
    </div>}
  </section>
}

