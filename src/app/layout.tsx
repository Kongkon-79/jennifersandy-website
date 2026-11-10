import type { Metadata } from 'next'
import './globals.css'
import { cn } from '@/lib/utils'
import { AppProvider } from '@/components/providers/AppProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { SiteHeader } from '@/components/shared/site-header'
import { SiteFooter } from '@/components/shared/site-footer'
import { Toaster } from '@/components/ui/sonner'
import { ShellWrapper } from '@/components/shared/shell-wrapper'

export const metadata: Metadata = {
  title: { default:'Möblierte Apartments in Düsseldorf | 0211wohnen', template:'%s | 0211wohnen' },
  description: 'Verfügbare möblierte Mietapartments und persönlicher Vermieterservice in Düsseldorf und Umgebung.',
  icons: {
    icon: [{ url: '/Fab%20icon.svg', type: 'image/svg+xml' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <AuthProvider>
          <AppProvider>
            <ShellWrapper header={<SiteHeader />} footer={<SiteFooter />}>
              <main>{children}</main>
            </ShellWrapper>
            <Toaster />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
