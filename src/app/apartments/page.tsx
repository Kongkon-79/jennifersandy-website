import type { Metadata } from 'next'
import { ApartmentsPageContent } from '@/components/apartments/apartments-page-content'

export const metadata: Metadata = {
  title: 'Verfügbare Apartments',
  description: 'Finden Sie verfügbare, vollständig möblierte Mietapartments in Düsseldorf und Umgebung.',
}

interface ApartmentsPageProps {
  searchParams?: Promise<{
    availableFrom?: string
    district?: string
    rooms?: string
    searchTerm?: string
  }>
}

export default async function ApartmentsPage({ searchParams }: ApartmentsPageProps) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-[#F9FBFC] font-manrope">
      <ApartmentsPageContent
        initialFilters={{
          availableFrom: params?.availableFrom,
          district: params?.district,
          rooms: params?.rooms,
          searchTerm: params?.searchTerm,
        }}
      />
    </div>
  )
}
