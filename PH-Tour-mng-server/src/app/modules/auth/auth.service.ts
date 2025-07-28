import Jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import statusCode from "http-status-codes";
import AppError from "../../errorHalpers/AppError";
import { IUser } from "../users/user.interface";
import { User } from "../users/user.model";
import { generateToken } from "../../utils/jwtTokenGen";
import { envVars } from "../../config/env";

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;
    const isUserExist = await User.findOne({ email })

    if (!isUserExist) {
        throw new AppError(statusCode.BAD_REQUEST, "User Does Not Exist")
    }

    const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string)
    if (!isPasswordMatched) {
        throw new AppError(statusCode.BAD_REQUEST, "Password is wrong!")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_TOKEN, envVars.JWT_TOKEN_EXPIRES)

    return { accessToken };
}

export const AuthService = {
    credentialsLogin
}