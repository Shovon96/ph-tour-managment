import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../users/user.interface";
import { BookingController } from "./booking.controller";

const router = Router()

router.post('/',
    checkAuth(...Object.values(Role)),
    BookingController.createBooking
)

router.get('/',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    BookingController.getAllBooking
)


export const BookingRoutes = router