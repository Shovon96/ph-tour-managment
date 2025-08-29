import type { ComponentType } from "react";

export interface ISidebarItems {
    title: string;
    url: string;
    items: {
        title: string;
        url: string;
        component: ComponentType;
    }[]
}

export type IRole = "SUPER_ADMIN" | "GUIDE" | "ADMIN" | "USER"