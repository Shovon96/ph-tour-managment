import Jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import statusCode from "http-status-codes";
import AppError from "../../errorHalpers/AppError";
import { IsActive, IUser } from "../users/user.interface";
import { User } from "../users/user.model";
import { generateToken, verifyToken } from "../../utils/jwtTokenGen";
import { envVars } from "../../config/env";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";
import passport from "passport";

// const credentialsLogin = async (payload: Partial<IUser>) => {
//     const { email, password } = payload;

//     const isUserExist = await User.findOne({ email })
//     if (!isUserExist) {
//         throw new AppError(statusCode.BAD_REQUEST, "User Does Not Exist")
//     }

//     const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string)
//     if (!isPasswordMatched) {
//         throw new AppError(statusCode.BAD_REQUEST, "Password is wrong!")
//     }

//     const userTokens = createUserTokens(isUserExist)
//     const { password: pass, ...rest } = isUserExist.toObject()

//     return {
//         accessToken: userTokens.accessToken,
//         refreshToken: userTokens.refreshToken,
//         user: rest
//     };
// }

const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return { accessToken: newAccessToken }

}

const resetPassword = async (newPassword: string, oldPassword: string, decodedToken: JwtPayload) => {
    
    const user = await User.findById(decodedToken.userId);
    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user!.password as string)

    if(!isOldPasswordMatch){
        throw new AppError(statusCode.UNAUTHORIZED, "Old password does not matched!")
    }

    user!.password = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))
    user!.save()
}

export const AuthService = {
    // credentialsLogin,
    getNewAccessToken,
    resetPassword
}