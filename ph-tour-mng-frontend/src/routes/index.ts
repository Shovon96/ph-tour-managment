import App from "@/App";
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
])
