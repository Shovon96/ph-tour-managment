import { envVars } from "../config/env"
import AppError from "../errorHalpers/AppError"
import { IAuthProvider, IUser, Role } from "../modules/users/user.interface"
import { User } from "../modules/users/user.model"
import bcrypt from 'bcryptjs'

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL })
        if (isSuperAdminExist) {
            console.log('Super Admin already exist')
            return
        }

        const hasedPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))
        const authProvider: IAuthProvider = {
            provider: 'credentials',
            providerId: envVars.SUPER_ADMIN_EMAIL
        }

        const payload: IUser = {
            name: "Super Admin",
            role: Role.SUPER_ADMIN,
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hasedPassword,
            isVerified: true,
            auth: [authProvider]
        }

        const superAdmin = await User.create(payload)
        console.log('Super admin created..')
        
    } catch (error) {
        throw new AppError(401, "Something error creating super admin!")
    }
}