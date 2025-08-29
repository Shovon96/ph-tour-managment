import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Booking from "@/pages/user/Booking";
import Verify from "@/pages/Verify";
import { generateRoutes } from "@/utils/generate.route";
import { createBrowserRouter } from "react-router";
import { adminSidebarItems } from "./adminSidebar.Items";


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
        Component: DashboardLayout,
        path: '/admin',
        children: [...generateRoutes(adminSidebarItems)]
    },
    {
        Component: DashboardLayout,
        path: '/users',
        children: [
            {
                Component: Booking,
                path: 'booking'
            }
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
    }
])
