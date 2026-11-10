import type { Metadata } from 'next'
import { AboutSections } from '@/components/about/about-sections'
export const metadata:Metadata={title:'Über 0211wohnen',description:'Lernen Sie 0211wohnen, unser Team und unseren Vermieterservice für möblierte Apartments in Düsseldorf kennen.'}
export default function AboutPage(){return <div className="min-h-screen bg-white font-manrope"><AboutSections/></div>}
