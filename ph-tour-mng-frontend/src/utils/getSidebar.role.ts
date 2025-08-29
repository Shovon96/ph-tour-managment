import { Role } from "@/constants/role";
import { adminSidebarItems } from "@/routes/adminSidebar.Items";
import { userSidebarItems } from "@/routes/userSidebar.items";
import type { IRole } from "@/types/index.type";

export const getSidebarItemsByRole = (userRole: IRole) => {
    switch (userRole) {
        case Role.superAdmin:
            return [...adminSidebarItems];
        case Role.admin:
            return [...adminSidebarItems];
        case Role.user:
            return [...userSidebarItems];
        default:
            return []
    }
}