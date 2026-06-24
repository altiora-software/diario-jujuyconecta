"use client";

import { usePathname } from "next/navigation";
import MundialTopBanner from "@/app/(public)/mundial-2026/components/MundialTopBanner";

export default function MundialBannerWrapper() {
  const pathname = usePathname();

  const hideBanner =
    pathname.startsWith("/mundial-2026");

  if (hideBanner) return null;

  return <MundialTopBanner />;
}
