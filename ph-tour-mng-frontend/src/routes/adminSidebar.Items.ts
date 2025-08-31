import { AddDivision } from "@/pages/admin/AddDivision";
import { AddTourType } from "@/pages/admin/AddTourType";
import type { ISidebarItems } from "@/types/index.type";
import { lazy } from "react";

const Analytics = lazy(() => import("@/pages/admin/Analytics"));
const AddTour = lazy(() => import("@/pages/admin/AddTour"));

export const adminSidebarItems: ISidebarItems[] = [
    {
        title: "Admin Dashboard",
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
            },
            {
                title: "Add Tour Type",
                url: "/admin/add-tour-type",
                component: AddTourType
            },
            {
                title: "Add Division",
                url: "/admin/add-division",
                component: AddDivision
            }
        ],
    },
]