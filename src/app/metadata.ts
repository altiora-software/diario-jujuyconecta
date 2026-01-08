import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://diario.jujuyconecta.com/";

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/jc.ico",
    shortcut: "/jc.ico",
    apple: "/jc.png",
  },
  title: {
    default: "Jujuy Conecta Diario | Noticias de Jujuy, Argentina y radio en vivo",
    template: "%s | Jujuy Conecta Diario",
  },
  description: "Jujuy Conecta Diario es el diario digital de Jujuy. Noticias de último momento, análisis, radio en vivo, clima, tránsito y comunidad.",
  keywords: [
    "Jujuy", "noticias Jujuy", "diario digital Jujuy", "Jujuy Conecta",
    "noticias de Jujuy hoy", "radio en vivo Jujuy", "actualidad Jujuy"
  ],
  authors: [{ name: "Jujuy Conecta" }],
  creator: "Jujuy Conecta",
  publisher: "Jujuy Conecta",
  category: "news",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "Jujuy Conecta Diario",
    title: "Jujuy Conecta Diario | Noticias de Jujuy y radio en vivo",
    description: "Noticias y actualidad de Jujuy y Argentina, con foco en la provincia y radio en vivo.",
    images: [{ url: "/og-diario.jpg", width: 1200, height: 630, alt: "Jujuy Conecta Diario" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jujuy Conecta Diario | Noticias de Jujuy y radio en vivo",
    images: ["/og-diario.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "theme-color": "#117A65",
    "geo.region": "AR-J",
    "geo.placename": "San Salvador de Jujuy",
  },
};