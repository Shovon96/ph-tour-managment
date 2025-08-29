import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Verify from "@/pages/Verify";
import { generateRoutes } from "@/utils/generate.route";
import { createBrowserRouter, redirect } from "react-router";
import { adminSidebarItems } from "./adminSidebar.Items";
import { userSidebarItems } from "./userSidebar.items"
import { authValidation } from "@/utils/auth.validation";
import { Role } from "@/constants/role";
import type { IRole } from "@/types/index.type";
import Unauthorized from "@/pages/Unauthorize";

export const routes = createBrowserRouter([
    {
        Component: App,
        path: '/',
        children: [
            // {
            //     path: 'about',
            //     element: <About />,
            // }
        ]
    },
    {
        Component: authValidation(DashboardLayout, (Role.admin as IRole) || (Role.superAdmin as IRole)),
        path: '/admin',
        children: [
            { index: true, loader: () => redirect("analytics") },
            ...generateRoutes(adminSidebarItems)
        ]
    },
    {
        Component: DashboardLayout,
        path: '/users',
        children: [
            { index: true, loader: () => redirect("booking") },
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
    }
])
