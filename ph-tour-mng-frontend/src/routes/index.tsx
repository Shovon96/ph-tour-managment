import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Verify from "@/pages/Verify";
import { generateRoutes } from "@/utils/generate.route";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./adminSidebar.Items";
import { userSidebarItems } from "./userSidebar.items"
import { authValidation } from "@/utils/auth.validation";
import { Role } from "@/constants/role";
import type { IRole } from "@/types/index.type";
import Unauthorized from "@/pages/Unauthorize";
import Homepage from "@/pages/home/HomePage";
import Tours from "@/pages/Tours";
import TourDetails from "@/pages/TourDetails";

export const routes = createBrowserRouter([
    {
        Component: App,
        path: '/',
        children: [
            {
                path: '/',
                element: <Homepage />,
            },
            {
                path: '/tour',
                element: <Tours />,
            }
        ]
    },
    {
        Component: authValidation(DashboardLayout, Role.superAdmin as IRole),
        path: '/admin',
        children: [
            { index: true, element: <Navigate to="/admin/analytics" /> },
            ...generateRoutes(adminSidebarItems)
        ]
    },
    {
        Component: authValidation(DashboardLayout, Role.admin as IRole),
        path: '/admin',
        children: [
            { index: true, element: <Navigate to="/admin/analytics" /> },
            ...generateRoutes(adminSidebarItems)
        ]
    },
    {
        Component: authValidation(DashboardLayout, (Role.user as IRole)),
        path: '/users',
        children: [
            { index: true, element: <Navigate to="/users/booking" /> },
            ...generateRoutes(userSidebarItems)
        ]
    },
    {
        Component: Login,
        path: '/login'
    },
    {
        Component: Register,
        path: '/register'
    },
    {
        Component: Verify,
        path: '/verify'
    },
    {
        Component: Unauthorized,
        path: '/unauthorized'
    },
    {
        Component: TourDetails,
        path: '/tour/:slug'
    }
])
