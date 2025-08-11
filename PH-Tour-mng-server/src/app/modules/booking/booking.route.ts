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

router.get("/my-bookings",
    checkAuth(...Object.values(Role)),
    BookingController.getUserBookings
);

// api/v1/booking/bookingId
// router.get("/:bookingId",
//     checkAuth(...Object.values(Role)),
//     BookingController.getSingleBooking
// );

// // api/v1/booking/bookingId/status
// router.patch("/:bookingId/status",
//     checkAuth(...Object.values(Role)),
//     validateRequest(updateBookingStatusZodSchema),
//     BookingController.updateBookingStatus
// );


export const BookingRoutes = router