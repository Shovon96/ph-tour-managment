import AppError from "../../errorHalpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import statusCode from 'http-status-codes'
import bcrypt, { hash } from 'bcryptjs'

const createUser = async (payload: Partial<IUser>) => {
    const { name, email, password, ...rest } = payload;
    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(statusCode.BAD_REQUEST, "User Already Exist")
    }

    const hashPassword = await bcrypt.hash(password as string, 10)
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

const getAllUsers = async () => {
    const users = await User.find({})
    const totalUser = await User.countDocuments()
    return {
        data: users,
        meta: { total: totalUser }
    }
}

export const UserServices = {
    createUser,
    getAllUsers
}