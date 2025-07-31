import Jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import statusCode from "http-status-codes";
import AppError from "../../errorHalpers/AppError";
import { IsActive, IUser } from "../users/user.interface";
import { User } from "../users/user.model";
import { generateToken, verifyToken } from "../../utils/jwtTokenGen";
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

const getNewAccessToken = async (refreshToken: string) => {

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

    return {
        accessToken
    };
}

export const AuthService = {
    credentialsLogin,
    getNewAccessToken
}