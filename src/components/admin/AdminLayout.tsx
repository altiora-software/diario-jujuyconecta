import type { ReactNode } from "react"

import AdminHeader from "./AdminHeader"
import AdminSidebar from "./AdminSidebar"

type AdminLayoutProps = {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <section className="min-h-screen bg-muted/40">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </section>
  )
}
