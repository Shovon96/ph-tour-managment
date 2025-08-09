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


export const BookingController = {
    createBooking
}