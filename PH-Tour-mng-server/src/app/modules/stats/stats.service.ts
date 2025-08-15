import { IsActive } from "../users/user.interface"
import { User } from "../users/user.model"


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


export const StatsService = {
    getUserStats
}