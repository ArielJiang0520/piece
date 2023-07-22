import '@/styles/globals.css'
import NavBar from '@/components/ui/navbar/NavBar'
import { Alike, Montserrat } from 'next/font/google'
import SupabaseProvider from './supabase-provider';

const alike = Alike({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-alike'
})

const montserrat = Montserrat({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-montserrat'
})


const meta = {
  title: 'New Age of Creative Writing | Piece',
  description: 'Generated by create next app',
  cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: 'https://subscription-starter.vercel.app',
  type: 'website'
};

export const metadata = {
  title: meta.title,
  description: meta.description,
  cardImage: meta.cardImage,
  robots: meta.robots,
  favicon: meta.favicon,
  url: meta.url,
  type: meta.type,
  openGraph: {
    url: meta.url,
    title: meta.title,
    description: meta.description,
    cardImage: meta.cardImage,
    type: meta.type,
    site_name: meta.title
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vercel',
    title: meta.title,
    description: meta.description,
    cardImage: meta.cardImage
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${alike.variable} ${montserrat.variable}`}>

      <body>
        <SupabaseProvider>
          <NavBar />
          <main className="min-h-screen bg-background flex flex-col items-center">
            {children}
          </main>
        </SupabaseProvider>
      </body>
    </html>
  )
}
