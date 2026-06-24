import type { ReactNode } from "react"

import AdminLayout from "@/components/admin/AdminLayout"

export const metadata = {
  title: "JUJUY CONECTA",
  description: "Plataforma digital de Jujuy",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}
