import { Types } from "mongoose";

export enum BOOKING_STATUS {
    PENDING = 'PENDING',
    CANCEL = 'CANCEL',
    COMPLETED = 'COMLETED',
    FAILED = 'FAILED'
}

export interface IBooking {
    user: Types.ObjectId
    tour: Types.ObjectId
    payment?: Types.ObjectId
    guestCount: Number
    status: BOOKING_STATUS
}