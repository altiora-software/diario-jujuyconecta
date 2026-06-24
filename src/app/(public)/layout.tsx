import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";

import { EnviarHistoriaSection } from "@/components/EnviarHistoriaSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MundialBannerWrapper from "@/components/MundialBannerWrapper";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://diario.jujuyconecta.com/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/jc.ico",
    shortcut: "/jc.ico",
    apple: "/jc.png",
  },
  title: {
    default: "Diario Digital | Noticias de Jujuy, Argentina y radio en vivo",
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
        url: "/og-diario.jpg",
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
  other: {
    "theme-color": "#117A65",
    "application-name": "Jujuy Conecta Diario",
    "apple-mobile-web-app-title": "Jujuy Conecta",
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
    "geo.region": "AR-J",
    "geo.placename": "San Salvador de Jujuy",
    "geo.position": "-24.1858;-65.2995",
    ICBM: "-24.1858, -65.2995",
    distribution: "global",
    rating: "general",
  },
};

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Jujuy Conecta Diario",
    url: siteUrl,
    logo: `${siteUrl}jc.png`,
    sameAs: ["https://www.instagram.com/jujuyconecta"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Salvador de Jujuy",
      addressRegion: "Jujuy",
      addressCountry: "AR",
    },
  };

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
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}buscar?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const jsonLd = [jsonLdOrg, jsonLdWebsite];

  return (
    <>
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
      <script
        id="ld-json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <Header />
      <MundialBannerWrapper />
      <main className="relative z-10">{children}</main>
      <EnviarHistoriaSection />
      <Footer />
    </>
  );
}
