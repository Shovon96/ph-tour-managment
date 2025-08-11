import AppError from "../../errorHalpers/AppError"
import { BOOKING_STATUS } from "../booking/booking.interface"
import { Booking } from "../booking/booking.model"
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface"
import { SSLService } from "../sslCommerz/sslCommerz.service"
import { PAYMENT_STATUS } from "./payment.interface"
import { Payment } from "./payment.model"
import statusCode from 'http-status-codes'

const initPayment = async (bookingId: string) => {
    const payment = await Payment.findOne({ booking: bookingId })

    if (!payment) {
        throw new AppError(statusCode.NOT_FOUND, "Payment Not Found. You have not booked this tour")
    }

    const booking = await Booking.findById(payment.booking)

    const userName = (booking?.user as any).name
    const userEmail = (booking?.user as any).email
    const userPhone = (booking?.user as any).phone
    const userAddress = (booking?.user as any).address

    const sslPayload: ISSLCommerz = {
        name: userName,
        email: userEmail,
        phone: userPhone,
        address: userAddress,
        amount: payment.amount,
        transactionId: payment.transactionId
    }

    const sslPayment = await SSLService.sslPaymentInit(sslPayload)

    return {
        paymentURL: sslPayment.GatewayPageURL
    }

}

const successPayment = async (query: Record<string, string>) => {

    const session = await Booking.startSession()
    session.startTransaction()

    try {

        const updatePayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PAYMENT_STATUS.PAID },
            { new: true, runValidators: true, session: session })

        await Booking.findByIdAndUpdate(updatePayment?.booking,
            { status: BOOKING_STATUS.COMPLETED },
            { runValidators: true, session: session }
        )

        await session.commitTransaction() // Transection
        session.endSession()

        return { success: true, message: "Payment Completed Successfully!" }

    } catch (error) {
        await session.abortTransaction() // RoleBack
        session.endSession()
        throw error
    }

}

const failPayment = async (query: Record<string, string>) => {

    const session = await Booking.startSession()
    session.startTransaction()

    try {

        const updatePayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PAYMENT_STATUS.FAILED },
            { new: true, runValidators: true, session: session })

        await Booking.findByIdAndUpdate(updatePayment?.booking,
            { status: BOOKING_STATUS.FAILED },
            { runValidators: true, session: session }
        )

        await session.commitTransaction() // Transection
        session.endSession()

        return { success: false, message: "Payment Failed!" }

    } catch (error) {
        await session.abortTransaction() // RoleBack
        session.endSession()
        throw error
    }

}

const cancelPayment = async (query: Record<string, string>) => {

    const session = await Booking.startSession()
    session.startTransaction()

    try {

        const updatePayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PAYMENT_STATUS.CANCEL },
            { runValidators: true, session: session })

        await Booking.findByIdAndUpdate(updatePayment?.booking,
            { status: BOOKING_STATUS.CANCEL },
            { runValidators: true, session: session }
        )

        await session.commitTransaction() // Transection
        session.endSession()

        return { success: false, message: "Payment Canceled!" }

    } catch (error) {
        await session.abortTransaction() // RoleBack
        session.endSession()
        throw error
    }

}


export const PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment
}