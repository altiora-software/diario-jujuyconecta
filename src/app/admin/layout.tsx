export const metadata = {
  title: "JUJUY CONECTA",
  description: "Plataforma digital de Jujuy",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-AR" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  )
}
