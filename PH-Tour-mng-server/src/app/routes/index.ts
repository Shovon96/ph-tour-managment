import { Router } from "express";
import { UserRouters } from "../modules/users/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { DivisionRoutes } from "../modules/division/division.route";
import { TourRoutes } from "../modules/tour/tour.route";
import { BookingRoutes } from "../modules/booking/booking.route";
import { PaymentRouters } from "../modules/payment/payment.route";
import { OtpRouter } from "../modules/otp/otp.route";

export const router = Router()

const moduleRoutes = [
    {
        path: '/user',
        route: UserRouters
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/division',
        route: DivisionRoutes
    },
    {
        path: '/tour',
        route: TourRoutes
    },
    {
        path: '/booking',
        route: BookingRoutes
    },
    {
        path: '/payment',
        route: PaymentRouters
    },
    {
        path: '/otp',
        route: OtpRouter
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})