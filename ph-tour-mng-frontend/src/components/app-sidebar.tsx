import * as React from "react"
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
import Logo from "@/assets/Logo"
import { Link } from "react-router"
import { useUseInfoQuery } from "@/redux/features/auth.api"
import { adminSidebarItems } from "@/routes/adminSidebar.Items"

// This is sample data.
const dashboardData = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: adminSidebarItems
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { data } = useUseInfoQuery(undefined)

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link to={"/"}>
          <Logo />
        </Link>
      </SidebarHeader>
      <div className="flex items-center my-2 gap-4 justify-center">
        <img className="rounded-full h-8 w-8" src="https://github.com/shadcn.png" alt="" />
        <p className="text-center">{data?.data?.name}</p>
      </div>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {dashboardData.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>{item.title}</Link>
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
