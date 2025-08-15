import { Aggregate } from "mongoose"
import { Tour } from "../tour/tour.model"
import { IsActive } from "../users/user.interface"
import { User } from "../users/user.model"
import { Booking } from "../booking/booking.model"
import { Payment } from "../payment/payment.model"
import { PAYMENT_STATUS } from "../payment/payment.interface"


const now = new Date()
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7)
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30)

const getUserStats = async () => {
    const totalUserPromise = User.countDocuments()

    const totalActiveUserPromise = User.countDocuments({ isActive: IsActive.ACTIVE })
    const totalInActiveUserPromise = User.countDocuments({ isActive: IsActive.INACTIVE })
    const totalBlockedUserPromise = User.countDocuments({ isActive: IsActive.BLOCKED })

    const newUsersLastSevenDaysPromise = User.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
    const newUsersLasThirtyDaysPromise = User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })

    const userByRolePromise = User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ])

    const [totalActiveUser, totalInActiveUser, totalBlockedUser, newUsersLastSevenDays, newUsersLasThirtyDays, userByRole] = await Promise.all([
        totalActiveUserPromise,
        totalInActiveUserPromise,
        totalBlockedUserPromise,
        newUsersLastSevenDaysPromise,
        newUsersLasThirtyDaysPromise,
        userByRolePromise
    ])

    return {
        totalActiveUser,
        totalInActiveUser,
        totalBlockedUser,
        newUsersLastSevenDays,
        newUsersLasThirtyDays,
        userByRole
    }
}

const getTourStats = async () => {
    const totalTourPromise = Tour.countDocuments()

    const totalTourByTourTypePromise = Tour.aggregate([
        // stage-1 : connect Tour Type model - lookup stage
        {
            $lookup: {
                from: "tourtypes",
                localField: "tourType",
                foreignField: "_id",
                as: "type"
            }
        },
        // stage-2: unwind the array of object
        {
            $unwind: "$type"
        },
        // stage-3: 
        {
            $group: {
                _id: "$type.name",
                count: { $sum: 1 }
            }
        }
    ])

    const avgTourCostPromise = Tour.aggregate([
        {
            $group: {
                _id: null,
                avgCost: { $avg: "$costFrom" }
            }
        }
    ])

    const totalTourByDivisionPromise = Tour.aggregate([
        // stage-1 : connect Tour Type model - lookup stage
        {
            $lookup: {
                from: "divisions",
                localField: "division",
                foreignField: "_id",
                as: "division"
            }
        },
        // stage-2: unwind the array of object
        {
            $unwind: "$division"
        },
        // stage-3: 
        {
            $group: {
                _id: "$division.name",
                count: { $sum: 1 }
            }
        }
    ])

    const totalHighestBookedTourPromis = Booking.aggregate([
        // stage-1: Group the tour
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 }
            }
        },
        // stage-2: sort the tour
        {
            $sort: { bookingCount: -1 }
        },
        // stage-3: sorting with limit
        {
            $limit: 5
        },
        // stage-4: lookup stage
        {
            $lookup: {
                from: "tours",
                let: { tourId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$tourId"] }
                        }
                    }
                ],
                as: "tour"
            }
        },
        // stage-5: unwind
        {
            $unwind: "$tour"
        },
        // stage-6: Project Stage
        {
            $project: {
                bookingCount: 1,
                "tour.title": 1,
                "tour.slug": 1
            }
        }
    ])

    const [totalTour, totalTourByTourType, avgTourCost, totalTourByDivision, totalHighestBookedTour] = await Promise.all([
        totalTourPromise,
        totalTourByTourTypePromise,
        avgTourCostPromise,
        totalTourByDivisionPromise,
        totalHighestBookedTourPromis
    ])

    return {
        totalTour,
        totalTourByTourType,
        avgTourCost,
        totalTourByDivision,
        totalHighestBookedTour
    }
}

const getBookingStats = async () => {
    const totalBooingPromise = Booking.countDocuments()

    const totalBookingByStatusPromise = Booking.aggregate([
        // stage-1: group stage
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ])

    const bookingsPerTourPromise = Booking.aggregate([
        // stage-1: group stage
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 }
            }
        },
        // stage-2: sort
        {
            $sort: { bookingCount: -1 }
        },
        // stage-3: limit
        {
            $limit: 10
        },
        // stage-4: lookup
        {
            $lookup: {
                from: "tours",
                localField: "_id",
                foreignField: "_id",
                as: "tour"
            }
        },
        // stage-5: unwind tours
        {
            $unwind: "$tour"
        },
        // stage-6: Project tour
        {
            $project: {
                _id: 1,
                bookingCount: 1,
                "tour.title": 1,
                "tour.slug": 1
            }
        }
    ])

    const avgGuestCountPerBookingPromise = Booking.aggregate([
        {
            $group: {
                _id: null,
                avgGuestCount: { $avg: "$guestCount" }
            }
        }
    ])

    const bookingLastSevenDaysPromise = Booking.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    })

    const bookingLastThirtyDaysPromise = Booking.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    })

    const totalBookingByUniqueUsersPromise = Booking.distinct("user").then((user: any) => user.length)

    const [totalBooing, totalBookingByStatus, bookingsPerTour, avgGuestCountPerBooking, bookingLastSevenDays, bookingLastThirtyDays, totalBookingByUniqueUsers] = await Promise.all([
        totalBooingPromise,
        totalBookingByStatusPromise,
        bookingsPerTourPromise,
        avgGuestCountPerBookingPromise,
        bookingLastSevenDaysPromise,
        bookingLastThirtyDaysPromise,
        totalBookingByUniqueUsersPromise
    ])

    return {
        totalBooing,
        totalBookingByStatus,
        bookingsPerTour,
        avgGuestCountPerBooking: avgGuestCountPerBooking[0].avgGuestCount,
        bookingLastSevenDays,
        bookingLastThirtyDays,
        totalBookingByUniqueUsers
    }
}

const getPaymentStats = async () => {
    const totalPaymentPromise = Payment.countDocuments()

    const totalPaymentByStatusPromise = Payment.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        },
    ])

    const totalRevenuePromise = Payment.aggregate([
        // stage-1: match payment status
        {
            $match: { status: PAYMENT_STATUS.PAID }
        },
        // stage-2: group
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" }
            }
        }

    ])

    const avgPaymentAmountPromise = Payment.aggregate([
        {
            $group: {
                _id: null,
                avgPaymentAmount: { $avg: "$amount" }
            }
        }
    ])

    const paymentGatewayDataPromise = Payment.aggregate([
        {
            $group: {
                _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
                count: { $sum: 1 }
            }
        }
    ])

    const [totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData] = await Promise.all([
        totalPaymentPromise,
        totalPaymentByStatusPromise,
        totalRevenuePromise,
        avgPaymentAmountPromise,
        paymentGatewayDataPromise
    ])

    return {
        totalPayment,
        totalPaymentByStatus,
        totalRevenue,
        avgPaymentAmount,
        paymentGatewayData
    }
}


export const StatsService = {
    getUserStats,
    getTourStats,
    getBookingStats,
    getPaymentStats
}