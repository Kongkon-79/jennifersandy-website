import Image from 'next/image'
import Link from 'next/link'

const teamMembers = [
  { role: 'Geschäftsführer', name: 'Daniel van der Vee', email: 'vdv@0211wohnen.de', image: 'https://cmspics.onoffice.de/VENTOSImmobilienGmbH/Daniel_2.jpg' },
  { role: 'Prokuristin & Vermietung', name: 'Alexandra Schmidt', email: 'as@0211wohnen.de', image: 'https://cmspics.onoffice.de/VENTOSImmobilienGmbH/alex.jpeg' },
  { role: 'Rechnungswesen', name: 'Philipp Leisten', email: 'pl@0211wohnen.de' },
  { role: 'Marketing', name: 'Sylvia van der Vee', email: 'svdv@0211wohnen.de', image: 'https://cmspics.onoffice.de/VENTOSImmobilienGmbH/Sylvia.jpg' },
  { role: 'Key-Accounts & Vermietung', name: 'Melanie Falcon', email: 'mf@0211wohnen.de' },
  { role: 'Objektbetreuung', name: 'Wojciech Kosiorek', email: 'hausmeister@0211wohnen.de', image: 'https://cmspics.onoffice.de/VENTOSImmobilienGmbH/Wojiech.jpeg' },
]

export function AboutSections() {
  return (
    <main className="bg-white py-12 text-[#6f7470]">
      <section className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="rounded-2xl bg-[#f5f3ef] p-7 md:p-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8b8175]">Über 0211wohnen</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#262626] md:text-5xl">Persönlich, professionell und serviceorientiert</h1>
            <p className="mt-6 leading-7">Wir sind ein familiengeführtes, inhabergeführtes Unternehmen und vermieten möblierte Designer-Apartments in Düsseldorf und Umgebung. Viele Angebote stammen aus unserem eigenen Bestand – deshalb achten wir konsequent auf Qualität, Verlässlichkeit und einen einheitlich hohen Wohnstandard.</p>
            <p className="mt-4 leading-7">Mit langjähriger Erfahrung und einem starken Netzwerk begleiten wir Mieter und Vermieter persönlich von der ersten Anfrage bis zum Einzug.</p>
          </div>
        </div>
      </section>
      <section id="vermieter" className="container mx-auto px-4 py-20 sm:px-6 lg:px-10"><div className="grid gap-8 lg:grid-cols-2"><div><p className="text-sm font-semibold uppercase tracking-[.16em]">Für Vermieter</p><h2 className="mt-3 text-3xl font-semibold text-[#262626]">Professioneller Vermieterservice</h2><p className="mt-5 leading-7">Wir unterstützen Eigentümer bei der professionellen Präsentation, Interessentenkommunikation, Vertragsabwicklung und laufenden Betreuung ihrer möblierten Apartments.</p></div><div className="grid gap-4 sm:grid-cols-2">{['Professionelle Vermarktung','Geprüfte Anfragen','Persönliche Betreuung','Transparente Abläufe'].map(item=><div key={item} className="rounded-xl border border-[#e3ded6] bg-[#f5f3ef] p-5 font-semibold text-[#262626]">✓ {item}</div>)}</div></div></section>
      <section className="container mx-auto px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl text-center"><h2 className="text-3xl font-semibold text-[#262626]">Unser Team</h2><p className="mt-3">Kompetente Ansprechpartner für Vermietung, Verwaltung und Objektbetreuung.</p></div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map(member => (
            <article key={member.name} className="rounded-xl border border-[#e3ded6] bg-white p-5 text-center shadow-sm">
              {member.image ? <Image src={member.image} alt={member.name} width={420} height={320} className="h-64 w-full rounded-lg object-cover object-top" /> : <div className="flex h-64 w-full items-center justify-center rounded-lg bg-[#d1c9be] text-4xl font-semibold text-[#262626]" aria-label={`${member.name} – Foto folgt`}>{member.name.split(' ').map(part => part[0]).join('')}</div>}
              <p className="mt-5 text-sm text-[#8b8175]">{member.role}</p><h3 className="mt-1 text-xl font-semibold text-[#262626]">{member.name}</h3><a className="mt-2 inline-block text-sm text-[#514b43] underline-offset-4 hover:underline" href={`mailto:${member.email}`}>{member.email}</a>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-[#f5f3ef] py-16"><div className="container mx-auto px-4 text-center sm:px-6 lg:px-10"><h2 className="text-3xl font-semibold text-[#262626]">Lassen Sie uns sprechen</h2><p className="mx-auto mt-4 max-w-2xl">Ob Wohnungssuche oder Vermietung: Unser Team berät Sie persönlich.</p><Link href="/contact" className="mt-7 inline-flex rounded-lg bg-[#6f7470] px-6 py-3 font-semibold text-white">Kontakt aufnehmen</Link></div></section>
    </main>
  )
}
