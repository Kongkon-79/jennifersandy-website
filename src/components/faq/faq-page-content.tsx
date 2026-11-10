'use client'

import Link from 'next/link'
import { FaqAccordion } from '@/components/shared/faq-accordion'

const faqs = [
  { question: 'Wie finde ich ein verfügbares Apartment?', answer: 'In der Immobilienübersicht können Sie nach Stadtteil, Zimmerzahl, Preis und Einzugsdatum filtern. Es werden ausschließlich aktuell freigegebene Mietangebote angezeigt.' },
  { question: 'Sind die Apartments möbliert?', answer: 'Unsere Angebote sind möblierte Apartments. Die genaue Ausstattung, Bilder und Konditionen finden Sie auf der jeweiligen Immobilienseite.' },
  { question: 'Wie stelle ich eine Anfrage?', answer: 'Öffnen Sie die gewünschte Immobilie und senden Sie das Anfrageformular ab. Angemeldete Nutzer sehen den Bearbeitungsstatus anschließend in ihrem persönlichen Bereich.' },
  { question: 'Kann ich einen Besichtigungstermin vereinbaren?', answer: 'Ja. Senden Sie uns eine Anfrage zur gewünschten Immobilie. Unser Vermietungsteam stimmt die verfügbaren Möglichkeiten persönlich mit Ihnen ab.' },
  { question: 'Welche Kosten fallen an?', answer: 'Miete, Pauschalmiete, Kaution und weitere verfügbare Preisangaben werden transparent auf der jeweiligen Detailseite ausgewiesen.' },
  { question: 'An wen kann ich mich bei Fragen wenden?', answer: 'Nutzen Sie unser Kontaktformular oder schreiben Sie an die zentrale E-Mail-Adresse. Ihre Anfrage wird an den passenden Ansprechpartner weitergeleitet.' },
]

export function FaqPageContent() {
  return <main className="py-12">
    <section className="container px-4 sm:px-6 lg:px-10">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6f7470]">Häufige Fragen</p>
      <h1 className="mt-3 text-4xl font-semibold text-[#262626]">Antworten rund um Ihre Wohnungssuche</h1>
      <p className="mt-4 max-w-2xl leading-7 text-[#6f7470]">Hier finden Sie kompakte Informationen zu unseren möblierten Apartments und zum Anfrageprozess.</p>
      <div className="mt-10"><FaqAccordion items={faqs} showHeader={false} /></div>
      <div className="mt-12 rounded-2xl bg-[#f0ede8] p-8 text-center"><h2 className="text-2xl font-semibold">Ihre Frage ist noch offen?</h2><p className="mt-3">Unser Team hilft Ihnen persönlich weiter.</p><Link href="/contact" className="brand-button mt-6">Kontakt aufnehmen</Link></div>
    </section>
  </main>
}
