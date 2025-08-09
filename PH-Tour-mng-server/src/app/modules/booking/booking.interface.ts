import { Types } from "mongoose";

export enum BOOKING_STATUS {
    PENDING = 'PENDING',
    CENCEL = 'CENCEL',
    COMPLETED = 'COMLETED',
    FAILED = 'FAILED'
}

export interface IBooking {
    user: Types.ObjectId
    tour: Types.ObjectId
    payment?: Types.ObjectId
    gestCount: Number
    status: BOOKING_STATUS
}