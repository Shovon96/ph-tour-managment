import type { ComponentType } from "react";
export type { ITourPackage } from "./tour.type";

export interface IResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
}

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