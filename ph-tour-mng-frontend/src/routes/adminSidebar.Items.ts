import type { ISidebarItems } from "@/types/index.type";
import { lazy } from "react";

const Analytics = lazy(() => import("@/pages/admin/Analytics"));
const AddTour = lazy(() => import("@/pages/admin/AddTour"));

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