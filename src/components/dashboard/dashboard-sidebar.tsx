"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Brand } from "@/components/brand/brand"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  ADMIN_ROUTES,
  adminMenuItems,
  DRIVER_ROUTES,
  driverMenuItems,
  PATIENT_ROUTES,
  patientMenuItems,
} from "@/routes"
import type { Role, SidebarItems } from "@/types"

const menus: Record<Role, SidebarItems> = {
  ADMIN: adminMenuItems,
  DRIVER: driverMenuItems,
  PATIENT: patientMenuItems,
}

const homeRoutes: Record<Role, string> = {
  ADMIN: ADMIN_ROUTES.dashboard,
  DRIVER: DRIVER_ROUTES.dashboard,
  PATIENT: PATIENT_ROUTES.dashboard,
}

export function DashboardSidebar({ userRole }: { userRole: Role }) {
  const pathname = usePathname()
  const routes = menus[userRole] ?? []

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <Brand href={homeRoutes[userRole]} showSubtitle />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {routes.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={pathname === item.url}
                    >
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
