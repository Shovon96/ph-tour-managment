import { useUseInfoQuery } from "@/redux/features/auth.api"
import type { IRole } from "@/types/index.type"
import type { ComponentType } from "react"
import { Navigate } from "react-router"
import Loader from "./Loader"

export const authValidation = (Component: ComponentType, userRole?: IRole) => {
    return function authWrapper() {
        const { data, isLoading } = useUseInfoQuery(undefined)

        if (isLoading) {
            return <Loader />
        }

        if (!isLoading && !data?.data?.email) {
            return <Navigate to="/login" />;
        }

        if (userRole && !isLoading && userRole !== data?.data?.role) {
            return <Navigate to="/unauthorized" />;
        }

        return <Component />
    }
}