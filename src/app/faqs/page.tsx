import type { Metadata } from 'next'
import { FaqPageContent } from '@/components/faq/faq-page-content'

export const metadata:Metadata={title:'Häufige Fragen',description:'Antworten zu möblierten Apartments, Anfragen, Einzug und Vermietung bei 0211wohnen.'}

export default function FaqsPage() {
  return (
    <div className="min-h-screen bg-[#F3F3F3] font-manrope">
      <FaqPageContent />
    </div>
  )
}
