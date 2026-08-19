import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/client/components/layout/navbar';
import { Footer } from '@/client/components/layout/footer';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'GSTU CSE — Student & Alumni Directory',
  description:
    'Official Student & Alumni Directory for the Department of Computer Science and Engineering, Gopalganj Science and Technology University (GSTU).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-foreground relative overflow-x-hidden">
        {/* Soft Champagne & Muted Gold Ambient Glows */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-tr from-amber-300/20 via-yellow-200/15 to-transparent blur-[140px] rounded-full" />
          <div className="absolute top-[650px] -right-36 w-[600px] h-[600px] bg-gradient-to-bl from-amber-200/25 via-amber-100/20 to-transparent blur-[150px] rounded-full" />
        </div>

        <Navbar />
        <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
