import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AddTour from "@/pages/admin/AddTour";
import Analytics from "@/pages/admin/Analytics";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Booking from "@/pages/user/Booking";
import Verify from "@/pages/Verify";
import { createBrowserRouter } from "react-router";


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
        children: [
            {
                Component: Analytics,
                path: 'analytics'
            },
            {
                Component: AddTour,
                path: 'add-tour'
            }
        ]
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
