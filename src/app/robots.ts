import type { MetadataRoute } from 'next'
export default function robots():MetadataRoute.Robots{const base=process.env.NEXT_PUBLIC_SITE_URL||'https://0211wohnen.de';return{rules:{userAgent:'*',allow:'/',disallow:['/account/','/api/','/dashboard/']},sitemap:`${base}/sitemap.xml`}}
