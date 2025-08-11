import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    const result = await BookingService.createBooking(req.body, decodedToken.userId)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Booking created",
        data: result,
    });
})

const getAllBooking = catchAsync(async (req: Request, res: Response) => {
    const result = await BookingService.getAllBooking()
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "All Booking Booking Successfully!",
        data: result,
    });
})

const getUserBookings = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;
    const bookings = await BookingService.getUserBookings(decodedToken as JwtPayload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Bookings retrieved successfully",
        data: bookings,
    });
}
);

const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const user = req.user
    const booking = await BookingService.getSingleBooking(bookingId, user as JwtPayload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking retrieved successfully",
        data: booking,
    });
}
);

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const { status } = req.body;
    const updateBooking = await BookingService.updateBookingStatus(bookingId, status);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking status updated successfully",
        data: updateBooking,
    });
}
);


export const BookingController = {
    createBooking,
    getAllBooking,
    getUserBookings,
    getSingleBooking,
    updateBookingStatus
}