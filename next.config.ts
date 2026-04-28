import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "joyueggtfcfzobphltme.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "media.prensa.jujuy.gob.ar",
        pathname: "/**", // Esto permite cualquier imagen de ese dominio
      },
    ],
  }
};

export default nextConfig;
