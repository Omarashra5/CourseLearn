import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { AuroraBackground } from '@/components/aurora-background';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://course-l2026.vercel.app/'),
  icons: {
    icon: '/icon.png',
  },
  title: {
    default: 'Learn Courses',
    template: '%s · Courses',
  },
  description:
    'A premium programming courses platform. Discover, search, and master coding with curated video courses from across the web.',
  keywords: [
    'programming courses',
    'learn to code',
    'web development',
    'javascript',
    'python',
    'react',
    'online coding tutorials',
  ],
  authors: [{ name: 'Courses' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Courses — Learn to Code, Beautifully',
    description:
      'A premium programming courses platform with curated video courses, instant search, and a futuristic learning experience.',
    siteName: 'Courses',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Courses — Learn to Code, Beautifully',
    description:
      'A premium programming courses platform with curated video courses, instant search, and a futuristic learning experience.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0f1f' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            <AuroraBackground />
            <Navbar />
            <main className="relative z-10 flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
