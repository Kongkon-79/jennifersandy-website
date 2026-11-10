'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchApartments } from '@/lib/apartments-api'

export function HomeHeroSection() {
  const [active, setActive] = useState(0)
  const { data } = useQuery({
    queryKey: ['home-authentic-property-slideshow'],
    queryFn: () => fetchApartments({ page: 1, limit: 8, vermarktungsart: 'miete', sortBy: 'createdAt', sortOrder: 'desc' }),
    staleTime: 300_000,
  })
  const slides = useMemo(() => (data?.apartments || []).map(apartment => ({
    image: apartment.images.find(image => !image.endsWith('/property-placeholder.svg')) || apartment.image,
    title: apartment.title,
  })).filter(slide => !slide.image.endsWith('/property-placeholder.svg')).slice(0, 8), [data])

  useEffect(() => {
    if (slides.length < 2) return
    const timer = window.setInterval(() => setActive(value => (value + 1) % slides.length), 3200)
    return () => window.clearInterval(timer)
  }, [slides.length])

  useEffect(() => setActive(0), [slides.length])

  return (
    <section className="container px-4 sm:px-6 lg:px-10" aria-labelledby="home-title">
      <div className="relative min-h-[520px] overflow-hidden rounded-2xl bg-[#ebe8e2] sm:min-h-[600px]">
        {slides.length > 0 ? slides.map((slide, index) => (
          <Image key={`${slide.image}-${index}`} src={slide.image} alt={slide.title} fill priority={index === 0} sizes="100vw" className={`object-cover transition-opacity duration-700 ${index === active ? 'opacity-100' : 'opacity-0'}`} />
        )) : <div className="absolute inset-0 bg-[#ebe8e2]" />}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
        <div className="relative z-10 flex min-h-[520px] max-w-3xl flex-col justify-center px-6 py-16 text-white sm:min-h-[600px] sm:px-12 lg:px-16">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/85">0211wohnen · Düsseldorf</p>
          <h1 id="home-title" className="text-4xl font-bold leading-tight text-white sm:text-6xl">Möblierte Apartments.<br />Einfach ankommen.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/90 sm:text-lg">Entdecken Sie aktuell verfügbare möblierte Mietapartments in Düsseldorf und Umgebung.</p>
          <Link href="/apartments" className="brand-button mt-8 w-fit">Apartments ansehen</Link>
        </div>
        {slides.length > 1 && <div className="absolute bottom-5 right-5 z-20 flex gap-2" aria-label="Slideshow"><span className="rounded-full bg-black/55 px-3 py-1 text-xs text-white">{active + 1} / {slides.length}</span></div>}
      </div>
    </section>
  )
}
