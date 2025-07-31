import Jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import statusCode from "http-status-codes";
import AppError from "../../errorHalpers/AppError";
import { IUser } from "../users/user.interface";
import { User } from "../users/user.model";
import { generateToken } from "../../utils/jwtTokenGen";
import { envVars } from "../../config/env";
import { createUserTokens } from "../../utils/userTokens";

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

    const userTokens = createUserTokens(isUserExist)
    const { password: pass, ...rest } = isUserExist.toObject()

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    };
}

export const AuthService = {
    credentialsLogin
}