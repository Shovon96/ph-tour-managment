import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { catchAsync } from "../../utils/catchAsync";
import { envVars } from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const initPayment = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId
    const result = await PaymentService.initPayment(bookingId)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Payment done successfully",
        data: result,
    });
})

const successPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await PaymentService.successPayment(query as Record<string, string>)
    if (result.success) {
        res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}
            ?transactionId=${query.transactionId}
            &message=${result.success}
            &amount=${query.amount}
            &status=${query.status} `)
    }
})

const failPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await PaymentService.failPayment(query as Record<string, string>)
    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}
            ?transactionId=${query.transactionId}
            &message=${result.success}
            &amount=${query.amount}
            &status=${query.status} `)
    }
})

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await PaymentService.cancelPayment(query as Record<string, string>)
    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}
            ?transactionId=${query.transactionId}
            &message=${result.success}
            &amount=${query.amount}
            &status=${query.status} `)
    }
})

const getInvoiceDownloadUrl = catchAsync(async (req: Request, res: Response) => {
    const { paymentId } = req.params
    const result = await PaymentService.getInvoiceDownloadUrl(paymentId)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Invoice download link retrive successfully",
        data: result,
    });
})


export const PaymentController = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
    getInvoiceDownloadUrl
}