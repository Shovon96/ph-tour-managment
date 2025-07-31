import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/users/user.interface";
import { generateToken, verifyToken } from "./jwtTokenGen";
import { User } from "../modules/users/user.model";
import AppError from "../errorHalpers/AppError";
import statusCode from 'http-status-codes'

export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_TOKEN, envVars.JWT_TOKEN_EXPIRES)

    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_TOKEN, envVars.JWT_REFRESH_EXPIRES)

    return {
        accessToken,
        refreshToken
    }
}

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {

    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_TOKEN) as JwtPayload
    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })

    if (!isUserExist) {
        throw new AppError(statusCode.BAD_REQUEST, "User Does Not Exist")
    }

    if (isUserExist.isActive === IsActive.INACTIVE || isUserExist.isActive === IsActive.BLOCKED) {
        throw new AppError(statusCode.BAD_REQUEST, `This use is ${isUserExist.isActive}`)
    }

    if (isUserExist.isDeleted) {
        throw new AppError(statusCode.BAD_REQUEST, "This user already deleted!")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_TOKEN, envVars.JWT_TOKEN_EXPIRES)

    return accessToken
}