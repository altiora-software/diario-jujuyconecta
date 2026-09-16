import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/mundial-2026",
        destination: "/seccion/deportes",
        permanent: true,
      },
      {
        source: "/mundial-2026/fixture",
        destination: "/seccion/deportes",
        permanent: true,
      },
      {
        source: "/seccion/mundial-2026",
        destination: "/seccion/deportes",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "joyueggtfcfzobphltme.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
