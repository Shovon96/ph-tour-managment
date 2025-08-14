import AppError from "../../errorHalpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import statusCode from 'http-status-codes'
import bcrypt, { hash } from 'bcryptjs'
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/queryBuilder";
import { userSearchableFields } from "./user.contant";

const createUser = async (payload: Partial<IUser>) => {
    const { name, email, password, ...rest } = payload;
    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(statusCode.BAD_REQUEST, "User Already Exist")
    }

    const hashPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))
    // const isPasswordMatched = await bcrypt.compare(password as string, hashPassword)
    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }

    const user = await User.create({
        name,
        email,
        password: hashPassword,
        auth: [authProvider],
        ...rest
    })
    return user
}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
        if (userId !== decodedToken.userId) {
            throw new AppError(statusCode.UNAUTHORIZED, "You are not authorized")
        }
    }

    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
        throw new AppError(statusCode.NOT_FOUND, "This user not found")
    }

    if (decodedToken.role === Role.ADMIN && isUserExist.role === Role.SUPER_ADMIN) {
        throw new AppError(statusCode.UNAUTHORIZED, "You are not authorized")
    }

    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(statusCode.FORBIDDEN, "You are not authorized for update")
        }
        // if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
        //     throw new AppError(statusCode.FORBIDDEN, "You are not authorized for update")
        // }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(statusCode.FORBIDDEN, "You are not authorized for update")
        }
    }

    // if (payload.password) {
    //     payload.password = await bcrypt.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
    // }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser;
}

const getAllUsers = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(User.find(), query)
    const usersData = queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        usersData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}

const myProfile = async (userId: string) => {
    const user = await User.findById(userId).select("-password")
    return { data: user }
}
const getSingleUser = async (id: string) => {
    const user = await User.findById(id).select("-password")
    return { data: user }
}

export const UserServices = {
    createUser,
    getAllUsers,
    updateUser,
    myProfile,
    getSingleUser
}