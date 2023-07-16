import './globals.css'
import NavBar from '@/components/ui/navbar/NavBar'
import { Alike, Montserrat } from 'next/font/google'

const alike = Alike({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-alike'
})

const montserrat = Montserrat({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-montserrat'
})



export const metadata = {
  title: 'New Age of Creative Writing | Piece',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${alike.variable} ${montserrat.variable}`}>

      <body>
        <main className="min-h-screen bg-background flex flex-col items-center">
          <NavBar />
          {children}
        </main>
      </body>
    </html>
  )
}
