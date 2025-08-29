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