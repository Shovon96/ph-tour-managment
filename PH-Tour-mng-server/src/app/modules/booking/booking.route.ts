import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../users/user.interface";
import { BookingController } from "./booking.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateBookingStatusZodSchema } from "./booking.validation";

const router = Router()

router.post('/',
    checkAuth(...Object.values(Role)),
    BookingController.createBooking
)

router.get('/',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    BookingController.getAllBooking
)

router.get("/my-bookings",
    checkAuth(...Object.values(Role)),
    BookingController.getUserBookings
);

router.get("/:bookingId",
    checkAuth(...Object.values(Role)),
    BookingController.getSingleBooking
);

router.patch("/:bookingId/status",
    checkAuth(...Object.values(Role)),
    validateRequest(updateBookingStatusZodSchema),
    BookingController.updateBookingStatus
);


export const BookingRoutes = router