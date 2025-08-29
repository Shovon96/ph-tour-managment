import { useUseInfoQuery } from "@/redux/features/auth.api"
import type { IRole } from "@/types/index.type"
import type { ComponentType } from "react"
import { useNavigate } from "react-router"

export const authValidation = (Component: ComponentType, userRole?: IRole) => {
    return function authWrapper() {
        const { data, isLoading } = useUseInfoQuery(undefined)
        const navigate = useNavigate()

        if (!isLoading && !data?.data?.email) {
            navigate("/login")
            return null
        }

        if (userRole && !isLoading && userRole === data?.data?.role) {
            navigate("/unauthorized")
            return null
        }

        return <Component />
    }
}