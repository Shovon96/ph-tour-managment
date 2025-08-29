import AddTour from "@/pages/admin/AddTour";
import Analytics from "@/pages/admin/Analytics";
import type { ISidebarItems } from "@/types/sidebarItems.type";

export const adminSidebarItems: ISidebarItems[] = [
    {
        title: "Dashboard",
        url: "#",
        items: [
            {
                title: "Analytics",
                url: "/admin/analytics",
                component: Analytics
            }
        ],
    },
    {
        title: "Tour Management",
        url: "#",
        items: [
            {
                title: "Add Tour",
                url: "/admin/add-tour",
                component: AddTour
            }
        ],
    },
]