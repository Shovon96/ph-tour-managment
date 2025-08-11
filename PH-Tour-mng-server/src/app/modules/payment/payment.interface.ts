import { Types } from "mongoose";

export enum PAYMENT_STATUS {
    PAID = 'PAID',
    UNPAID = 'UNPAID',
    CANCEL = 'CANCEL',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
}

export interface IPayment {
    booking: Types.ObjectId
    transactionId: string
    amount: number
    paymentGetwayData?: any
    invoiceURL?: string
    status: PAYMENT_STATUS
}