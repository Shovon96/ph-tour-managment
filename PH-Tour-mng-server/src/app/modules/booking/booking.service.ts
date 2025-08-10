import AppError from "../../errorHalpers/AppError"
import { PAYMENT_STATUS } from "../payment/payment.interface"
import { Payment } from "../payment/payment.model"
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface"
import { SSLService } from "../sslCommerz/sslCommerz.service"
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

    const session = await Booking.startSession()
    session.startTransaction()

    try {
        const user = await User.findById(userId);
        if (!user?.toObject().phone || !user?.toObject().address) {
            throw new AppError(statusCode.BAD_REQUEST, "Please Update Your Profile to Book a Tour.")
        }

        const tour = await Tour.findById(payload.tour).select('costFrom')
        if (!tour?.costFrom) {
            throw new AppError(statusCode.BAD_REQUEST, "There is no Tour cost found!")
        }

        const amount = Number(tour.costFrom) * Number(payload.guestCount)

        const booking = await Booking.create([{
            user: userId,
            status: BOOKING_STATUS.PENDING,
            ...payload
        }], { session })

        const payment = await Payment.create([{
            booking: booking[0]._id,
            status: PAYMENT_STATUS.UNPAID,
            transactionId,
            amount
        }], { session })

        const updatedBooking = await Booking.
            findByIdAndUpdate(booking[0]._id,
                { payment: payment[0]._id },
                { new: true, runValidators: true, session }
            )
            .populate('user', 'name email phone address')
            .populate('tour', 'title costFrom')
            .populate('payment')

        // for sslPayment transaction fullfill
        const userName = (updatedBooking?.user as any).name
        const userEmail = (updatedBooking?.user as any).email
        const userPhone = (updatedBooking?.user as any).phone
        const userAddress = (updatedBooking?.user as any).address

        const sslPayload: ISSLCommerz = {
            name: userName,
            email: userEmail,
            phone: userPhone,
            address: userAddress,
            amount: amount,
            transactionId: transactionId
        }

        const sslPayment = await SSLService.sslPaymentInit(sslPayload)

        session.commitTransaction() // Transection
        session.endSession()

        return {
            payment: sslPayment,
            booking: updatedBooking
        }

    } catch (error) {
        await session.abortTransaction() // RoleBack
        session.endSession()
        throw error
    }

}


export const BookingService = {
    createBooking
}