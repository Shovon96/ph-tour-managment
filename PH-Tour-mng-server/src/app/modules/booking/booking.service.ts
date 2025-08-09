import AppError from "../../errorHalpers/AppError"
import { PAYMENT_STATUS } from "../payment/payment.interface"
import { Payment } from "../payment/payment.model"
import { Tour } from "../tour/tour.model"
import { User } from "../users/user.model"
import { BOOKING_STATUS, IBooking } from "./booking.interface"
import { Booking } from "./booking.model"
import statusCode from 'http-status-codes'

// Generate a Random ID
const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}

const createBooking = async (payload: Partial<IBooking>, userId: string) => {

    const transactionId = getTransactionId()
    // const user = await User.findById(userId)
    // if (!user?.phone || !user.address) {
    //     throw new AppError(statusCode.BAD_REQUEST, `Please update your profile infromation`)
    // }

    const user = await User.findById(userId);

    if (!user?.toObject().phone || !user?.toObject().address) {
        throw new AppError(statusCode.BAD_REQUEST, "Please Update Your Profile to Book a Tour.")
    }

    const tour = await Tour.findById(payload.tour).select('costFrom')
    if (!tour?.costFrom) {
        throw new AppError(statusCode.BAD_REQUEST, "There is no Tour cost found!")
    }

    const amount = Number(tour.costFrom) * Number(payload.guestCount)

    const booking = await Booking.create({
        user: userId,
        status: BOOKING_STATUS.PENDING,
        ...payload
    })

    const payment = await Payment.create({
        booking: booking._id,
        status: PAYMENT_STATUS.UNPAID,
        transactionId,
        amount
    })

    const updatedBooking = await Booking.findByIdAndUpdate(booking._id,
        { payment: payment._id },
        { new: true, runValidators: true }
    )

    return updatedBooking

}


export const BookingService = {
    createBooking
}