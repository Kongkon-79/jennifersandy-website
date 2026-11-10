import type { Metadata } from 'next'
import { ContactForm, ContactInfo } from '@/components/contact/contact-form'
import { GoogleMapEmbed } from '@/components/contact/google-map'

export default function ContactUsPage() {
  return <main className="bg-white py-12">
    <section className="container px-4 sm:px-6 lg:px-10">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6f7470]">Kontakt</p>
      <h1 className="mt-3 text-4xl font-semibold text-[#262626]">Wir sind für Sie da</h1>
      <p className="mt-4 max-w-2xl leading-7 text-[#6f7470]">Sie interessieren sich für ein möbliertes Apartment oder möchten Ihre Immobilie vermieten? Schreiben Sie uns. Ihre Anfrage wird zentral entgegengenommen und an den passenden Ansprechpartner weitergeleitet.</p>
    </section>
    <section className="container mt-10 px-4 sm:px-6 lg:px-10"><div className="rounded-2xl border border-stone-200 bg-[#f7f6f3] p-6 md:p-10"><h2 className="text-2xl font-semibold">Nachricht senden</h2><p className="mb-6 mt-2 text-sm text-[#6f7470]">Wir melden uns so schnell wie möglich bei Ihnen.</p><ContactForm /></div></section>
    <section className="container mt-10 grid items-start gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-10"><GoogleMapEmbed /><ContactInfo /></section>
  </main>
}
export const metadata:Metadata={title:'Kontakt',description:'Kontaktieren Sie 0211wohnen für möblierte Apartments und Vermieterservice in Düsseldorf.'}
