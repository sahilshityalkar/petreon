import { Inter } from 'next/font/google'
import { Navbar } from '@/component/navbar'
import { Toaster } from "@/components/ui/toaster"
import './globals.css' 

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Petreon',
  description: 'A social platform for pet lovers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}

