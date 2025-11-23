// src/app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Providers } from "./providers";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://jujuyconecta.online/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jujuy Conecta Diario | Noticias de Jujuy, Argentina y radio en vivo",
    template: "%s | Jujuy Conecta Diario",
  },
  description:
    "Diario digital de Jujuy. Noticias provinciales y nacionales, transporte, obras, comunidad, deportes, cultura y radio en vivo.",
  keywords: [
    "Jujuy",
    "noticias Jujuy",
    "diario digital",
    "Jujuy Conecta",
    "radio en vivo",
    "noticias provinciales",
    "noticias Argentina",
  ],
  authors: [{ name: "Jujuy Conecta" }],
  creator: "Jujuy Conecta",
  publisher: "Jujuy Conecta",
  category: "news",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "Jujuy Conecta Diario",
    title: "Jujuy Conecta Diario | Noticias de Jujuy y radio en vivo",
    description:
      "Noticias y actualidad de Jujuy y Argentina, con foco en la provincia, el transporte, la comunidad y las obras.",
    images: [
      {
        url: "/og-diario.jpg", // poné una imagen 1200x630 en /public
        width: 1200,
        height: 630,
        alt: "Jujuy Conecta Diario",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jujuy Conecta Diario | Noticias de Jujuy y radio en vivo",
    description:
      "Diario digital de Jujuy con noticias provinciales, nacionales y radio en vivo.",
    images: ["/og-diario.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  other: {
    "theme-color": "#117A65",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD básico para medio de noticias
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Jujuy Conecta Diario",
    url: siteUrl,
    logo: `${siteUrl}/jc-logo.png`,
    sameAs: [
      "https://www.instagram.com/jujuyconecta",
      // agregá más redes si las tenés
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Salvador de Jujuy",
      addressRegion: "Jujuy",
      addressCountry: "AR",
    },
  };

  return (
    <html lang="es">
      <head>
        {/* Google AdSense */}
        <Script
          id="adsense-script"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2751071957273972"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* JSON-LD */}
        <Script
          id="ld-news-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground antialiased">
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
