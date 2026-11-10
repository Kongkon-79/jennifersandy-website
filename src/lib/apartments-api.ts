import type { ApiEnvelope, PaginationMeta } from '@/types/dashboard'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export interface EstateImage {
  id?: number
  type?: string
  url?: string
  title?: string
}

export interface OnofficeEstate {
  _id: string
  onofficeId: number
  slug?: string
  objekttitel?: string
  objektbeschreibung?: string
  lage?: string
  ausstatt_beschr?: string
  wohnflaeche?: number
  anzahl_zimmer?: number
  anzahl_badezimmer?: number
  anzahl_schlafzimmer?: number
  kaltmiete?: number
  warmmiete?: number
  kaufpreis?: number
  miete_pauschal?: number
  price?: number | null
  priceType?: 'rent' | 'purchase' | 'unknown'
  pricePeriod?: 'day' | 'week' | 'month' | null
  priceLabel?: string
  rentalStatusLabel?: string
  rentalStatus?: 'available' | 'vacant' | 'partially_vacant' | 'rented' | 'reserved' | 'sold' | 'unknown'
  verfuegbarAbText?: string
  showGoogleMap?: boolean
  kaution?: number
  nebenkosten?: number
  vermarktungsart?: string
  objektart?: string
  objekttyp?: string
  ort?: string
  plz?: string
  strasse?: string
  hausnummer?: string
  stadtteil?: string
  breitengrad?: number | null
  laengengrad?: number | null
  balkon?: string
  terrasse?: string
  fahrstuhl?: string
  moebliert?: string
  haustiere?: string
  verfuegbar_ab?: string | null
  minimumStay?: string
  amenities?: {
    furnished?: boolean
    transportationParking?: boolean
    wifi?: boolean
    elevator?: boolean
    fittedKitchen?: boolean
    emergencyAlertSystem?: boolean
    moveInCoordination?: boolean
    mealPreparationService?: boolean
    petFriendly?: boolean
    balcony?: boolean
  }
  whyChoose?: string[]
  locationHighlights?: {
    label: string
    distance: string
  }[]
  images?: EstateImage[]
  titleImage?: EstateImage | null
}

export interface Apartment {
  id: string
  onOfficeId: string
  title: string
  price: number
  priceType: 'rent' | 'purchase' | 'unknown'
  pricePeriod: 'day' | 'week' | 'month' | null
  priceLabel: string
  rentalStatus: string
  hasMapLocation: boolean
  size: number
  rooms: number
  hasBalcony: boolean
  availableFrom: string
  image: string
  images: string[]
  district: string
  city: string
  lat: number
  lng: number
  amenities: string[]
  description: string
  deposit: number
  minimumStay: number
  serviceFee: string
  locationSubtitle: string
  locationDescription: string
  locationDetails: {
    subway: string
    restaurants: string
    rhine: string
  }
  locationHighlights: {
    label: string
    distance: string
  }[]
  whyChoose: string[]
}

export interface ApartmentListResponse {
  apartments: Apartment[]
  meta?: PaginationMeta
}

export interface PopularArea {
  district: string
  city?: string
  count: number
}

export interface ApartmentQueryParams {
  vermarktungsart?: 'miete' | 'kauf'
  searchTerm?: string
  district?: string
  minRooms?: number
  maxRooms?: number
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  availableFrom?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

const fallbackImage = '/images/property-placeholder.svg'

const amenityLabels: Array<
  [keyof NonNullable<OnofficeEstate['amenities']>, string]
> = [
  ['furnished', 'Möbliert'],
  ['transportationParking', 'Parkmöglichkeiten'],
  ['wifi', 'WLAN'],
  ['elevator', 'Aufzug'],
  ['fittedKitchen', 'Einbauküche'],
  ['moveInCoordination', 'Einzugskoordination'],
  ['petFriendly', 'Haustiere erlaubt'],
  ['balcony', 'Balkon / Terrasse'],
]

function isEnabled(value?: string | boolean | null) {
  if (typeof value === 'boolean') return value
  if (!value) return false

  const normalized = value.toLowerCase()
  return ['1', 'true', 'yes', 'ja', 'y', 'j'].includes(normalized)
}

function getImages(estate: OnofficeEstate) {
  const urls = [
    estate.titleImage?.url,
    ...(estate.images?.map(image => image.url) ?? []),
  ].filter((url): url is string => Boolean(url))

  return Array.from(new Set(urls))
}

function descriptionAmenities(estate: OnofficeEstate) {
  return [estate.ausstatt_beschr, estate.objektbeschreibung].filter(Boolean)
    .flatMap(text => String(text).split(/\r?\n/)).map(line => line.trim())
    .filter(line => /^[-–•]\s+/.test(line)).map(line => line.replace(/^[-–•]\s+/, '').trim()).filter(Boolean)
}

function formatAvailability(estate: OnofficeEstate) {
  if (estate.verfuegbar_ab) return `Verfügbar ab ${new Intl.DateTimeFormat('de-DE',{month:'2-digit',year:'numeric'}).format(new Date(estate.verfuegbar_ab))}`
  const text=String(estate.verfuegbarAbText||'').trim()
  if (!text || /sofort|leerstehend|verfügbar/i.test(text)) return 'Sofort verfügbar'
  if (/unbefristet/i.test(text)) return 'Verfügbarkeit auf Anfrage'
  return text
}

function buildAmenities(estate: OnofficeEstate) {
  const amenities = amenityLabels
    .filter(([key]) => estate.amenities?.[key])
    .map(([, label]) => label)

  if (isEnabled(estate.moebliert) && !amenities.includes('Möbliert')) {
    amenities.push('Möbliert')
  }
  if (isEnabled(estate.fahrstuhl) && !amenities.includes('Aufzug')) {
    amenities.push('Aufzug')
  }
  if (
    (isEnabled(estate.balkon) || isEnabled(estate.terrasse)) &&
    !amenities.includes('Balkon / Terrasse')
  ) {
    amenities.push('Balkon / Terrasse')
  }
  if (isEnabled(estate.haustiere) && !amenities.includes('Haustiere erlaubt')) {
    amenities.push('Haustiere erlaubt')
  }

  return Array.from(new Set([...amenities,...descriptionAmenities(estate)]))
}

function toNumber(value: unknown, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function cleanTitle(value?: string | null) {
  if (!value) return ''

  return value
    .replace(/^\s*\*+\s*/, '')
    .replace(/\s*\*+\s*$/, '')
    .trim()
}

export function normalizeEstateToApartment(estate: OnofficeEstate): Apartment {
  const images = getImages(estate)
  const priceType = estate.priceType || (estate.vermarktungsart === 'kauf' ? 'purchase' : estate.vermarktungsart === 'miete' ? 'rent' : 'unknown')
  const price = toNumber(estate.price !== undefined ? estate.price : priceType === 'purchase' ? estate.kaufpreis : priceType === 'rent' ? estate.miete_pauschal || estate.warmmiete || estate.kaltmiete : null)
  const district = /^(ind|obj|feld)[A-Za-z0-9_]*$/i.test(estate.stadtteil || '') ? estate.ort || '' : estate.stadtteil || estate.ort || ''
  const lat = estate.breitengrad == null ? NaN : toNumber(estate.breitengrad, NaN)
  const lng = estate.laengengrad == null ? NaN : toNumber(estate.laengengrad, NaN)
  const address = [estate.strasse, estate.hausnummer, estate.plz, estate.ort]
    .filter(Boolean)
    .join(' ')
  const locationHighlights = estate.locationHighlights ?? []

  return {
    id: estate.slug || String(estate.onofficeId || estate._id),
    onOfficeId: estate._id,
    title:
      cleanTitle(estate.objekttitel) || 'Immobilie',
    price,
    priceType,
    pricePeriod: estate.pricePeriod || null,
    priceLabel: estate.priceLabel || (priceType === 'purchase' ? 'Kaufpreis' : priceType === 'rent' ? estate.miete_pauschal ? 'Pauschalmiete' : estate.warmmiete ? 'Warmmiete' : 'Kaltmiete' : ''),
    rentalStatus: ['available', 'vacant', 'partially_vacant'].includes(estate.rentalStatus || '') ? 'Sofort verfügbar' : estate.rentalStatusLabel || '',
    hasMapLocation: estate.showGoogleMap === true && Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 && !(lat === 0 && lng === 0),
    size: toNumber(estate.wohnflaeche),
    rooms: toNumber(estate.anzahl_zimmer),
    hasBalcony:
      isEnabled(estate.balkon) ||
      isEnabled(estate.terrasse) ||
      Boolean(estate.amenities?.balcony),
    availableFrom: formatAvailability(estate),
    image: images[0] || fallbackImage,
    images: images.length > 0 ? images : [fallbackImage],
    district,
    city: estate.ort || '',
    lat,
    lng,
    amenities: buildAmenities(estate),
    description:
      [estate.objektbeschreibung, estate.ausstatt_beschr]
        .filter(Boolean)
        .join('\n\n') || '',
    deposit: toNumber(estate.kaution),
    minimumStay: toNumber(estate.minimumStay),
    serviceFee: estate.nebenkosten
      ? `${estate.nebenkosten.toLocaleString('de-DE')} €`
      : 'Auf Anfrage',
    locationSubtitle: address || district,
    locationDescription:
      estate.lage || '',
    locationDetails: {
      subway: locationHighlights[0]?.distance || '',
      restaurants: locationHighlights[1]?.distance || '',
      rhine: locationHighlights[2]?.distance || '',
    },
    locationHighlights,
    whyChoose: estate.whyChoose ?? [],
  }
}

export function formatApartmentPrice(apartment: Pick<Apartment, 'price' | 'pricePeriod' | 'priceType'>) {
  const amount = apartment.price > 0 ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(apartment.price) : 'Preis auf Anfrage'
  const period = apartment.priceType === 'rent' ? { day: ' / Tag', week: ' / Woche', month: ' / Monat' }[apartment.pricePeriod || 'month'] : ''
  return amount + (apartment.price > 0 && apartment.priceType === 'rent' ? period : '')
}

async function apiRequest<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    const err = await response.json().catch(() => null)
    throw new Error(err?.message || 'Request failed')
  }

  return response.json() as Promise<T>
}

export async function fetchApartments(params: ApartmentQueryParams = {}) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value))
    }
  })

  const query = searchParams.toString()
  const response = await apiRequest<ApiEnvelope<OnofficeEstate[]>>(
    `/onoffice/estates${query ? `?${query}` : ''}`,
  )

  return {
    apartments: response.data.map(normalizeEstateToApartment),
    meta: response.meta,
  } satisfies ApartmentListResponse
}

export async function fetchApartmentBySlugOrId(slugOrId: string) {
  const isNumericId = /^\d+$/.test(slugOrId)
  const endpoint = isNumericId
    ? `/onoffice/estates/${encodeURIComponent(slugOrId)}`
    : `/onoffice/estates/slug/${encodeURIComponent(slugOrId)}`

  const response = await apiRequest<ApiEnvelope<OnofficeEstate>>(endpoint, {
    cache: 'no-store',
  })

  return normalizeEstateToApartment(response.data)
}

export async function fetchSimilarApartments(slugOrId: string, limit = 4) {
  if (/^\d+$/.test(slugOrId)) {
    const response = await fetchApartments({ limit })
    return response.apartments
  }

  const response = await apiRequest<ApiEnvelope<OnofficeEstate[]>>(
    `/onoffice/estates/slug/${encodeURIComponent(slugOrId)}/similar?limit=${limit}`,
    { cache: 'no-store' },
  )

  return response.data.map(normalizeEstateToApartment)
}

export async function fetchPopularAreas() {
  const response = await apiRequest<ApiEnvelope<PopularArea[]>>(
    '/onoffice/popular-areas',
  )

  return response.data
}
