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
  icons: {
    icon: "/favicon.ico",                // favicon clásico
    shortcut: "/favicon.ico",            // atajo para navegadores antiguos
    apple: "/apple-touch-icon.png",      // opcional: si querés soporte iOS (colocá este archivo en /public)
  },
  title: {
    default:
      "Jujuy Conecta Diario | Noticias de Jujuy, Argentina y radio en vivo",
    template: "%s | Jujuy Conecta Diario",
  },
  description:
    "Jujuy Conecta Diario es el diario digital de Jujuy. Noticias de último momento, análisis, radio en vivo, clima, tránsito, transporte público, obras, comunidad, deportes, cultura y agenda de la provincia.",
  keywords: [
    "Jujuy",
    "noticias Jujuy",
    "diario digital Jujuy",
    "Jujuy Conecta",
    "noticias de Jujuy hoy",
    "radio en vivo Jujuy",
    "noticias provinciales",
    "noticias Argentina",
    "actualidad Jujuy",
    "clima Jujuy",
    "tránsito Jujuy",
    "transporte público Jujuy",
    "deportes Jujuy",
    "cultura Jujuy",
    "agenda Jujuy",
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
      "Noticias y actualidad de Jujuy y Argentina, con foco en la provincia, el transporte, el clima, la comunidad, las obras y la radio en vivo.",
    images: [
      {
        url: "/og-diario.jpg", // 1200x630 en /public
        width: 1200,
        height: 630,
        alt: "Jujuy Conecta Diario: noticias de Jujuy, Argentina y radio en vivo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jujuy Conecta Diario | Noticias de Jujuy y radio en vivo",
    description:
      "Diario digital de Jujuy con noticias provinciales, nacionales, clima, tránsito y radio en vivo.",
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
  icons: {
    icon: [
      { url: "/jc.ico", sizes: "any" },
      { url: "/jc.png", type: "image/png" },
    ],
    shortcut: "/jc.ico",
    apple: "/jc.png",
  },
  other: {
    "theme-color": "#117A65",
    "application-name": "Jujuy Conecta Diario",
    "apple-mobile-web-app-title": "Jujuy Conecta",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
    "geo.region": "AR-J",
    "geo.placename": "San Salvador de Jujuy",
    "geo.position": "-24.1858;-65.2995",
    ICBM: "-24.1858, -65.2995",
    "distribution": "global",
    "rating": "general",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD para organización de noticias
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Jujuy Conecta Diario",
    url: siteUrl,
<<<<<<< HEAD
    logo: `${siteUrl}/jc-loguito.png`,
=======
    logo: `${siteUrl}jc.png`,
>>>>>>> main
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

  // JSON-LD para el sitio web completo
  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Jujuy Conecta Diario",
    url: siteUrl,
    inLanguage: "es-AR",
    description:
      "Diario digital de Jujuy con noticias de último momento, radio en vivo y servicios útiles para la provincia.",
    publisher: {
      "@type": "Organization",
      name: "Jujuy Conecta",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}jc.png`,
      },
    },
  };

  const jsonLd = [jsonLdOrg, jsonLdWebsite];

  return (
    <html lang="es">
      <head>
<<<<<<< HEAD
      <link rel="icon" href="/favicon.ico" />
      <link rel="shortcut icon" href="/favicon.ico" />
=======
        {/* Favicon e íconos principales */}
        <link rel="icon" href="/jc.ico" />
        <link rel="shortcut icon" href="/jc.ico" />
        <link rel="apple-touch-icon" href="/jc.png" />

>>>>>>> main
        {/* Google tag (gtag.js) */}
        <Script
          id="gtag-src"
          src="https://www.googletagmanager.com/gtag/js?id=G-KS718BB0WX"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KS718BB0WX');
            `,
          }}
        />

        {/* Google AdSense */}
        <Script
          id="adsense-script"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2751071957273972"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* JSON-LD estructurado para Google News y SEO */}
        <Script
          id="ld-json"
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
