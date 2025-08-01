import { Router } from "express";
import { UserRouters } from "../modules/users/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";

export const router = Router()

const moduleRoutes = [
    {
        path: '/user',
        route: UserRouters
    },
    {
        path: '/auth',
        route: AuthRoutes
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})