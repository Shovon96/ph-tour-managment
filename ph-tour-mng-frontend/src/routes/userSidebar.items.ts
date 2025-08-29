import Booking from "@/pages/user/Booking";
import type { ISidebarItems } from "@/types/index.type";

export const userSidebarItems: ISidebarItems[] = [
    {
        title: "User Dashboard",
        url: "#",
        items: [
            {
                title: "Booking",
                url: "/users/booking",
                component: Booking
            }
        ],
    }
]