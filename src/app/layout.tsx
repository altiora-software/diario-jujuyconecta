import type { ReactNode } from "react";

import "./globals.css";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es-AR" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased selection:bg-primary/30 min-h-screen relative overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
