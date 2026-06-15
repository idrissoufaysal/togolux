import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TogoLux Properties — Agence Immobilière de Standing à Lomé',
  description:
    "TogoLux Properties est votre partenaire immobilier de confiance à Lomé, Togo. Achat, vente, location, gestion locative clé en main (Airbnb), rénovation et suivi de chantiers pour résidents et diaspora.",
  keywords: [
    'immobilier',
    'lome',
    'togo',
    'villa lome',
    'location court sejour lome',
    'airbnb lome',
    'achat terrain togo',
    'diaspora togo',
  ],
  authors: [{ name: 'TogoLux Team' }],
  creator: 'TogoLux Properties',
  openGraph: {
    title: 'TogoLux Properties — Immobilier d\'Exception à Lomé',
    description:
      'Découvrez nos villas modernes, duplexes prestige et appartements de standing disponibles à la vente et à la location à Lomé.',
    type: 'website',
    url: 'https://togolux.com',
    siteName: 'TogoLux Properties',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'TogoLux Properties Luxury Villa',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col justify-between bg-stone-50 text-stone-900 selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
