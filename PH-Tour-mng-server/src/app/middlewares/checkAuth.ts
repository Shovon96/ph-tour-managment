import { NextFunction, Request, Response } from "express";
import AppError from "../errorHalpers/AppError";
import Jwt, { JwtPayload } from 'jsonwebtoken'
import { verifyToken } from "../utils/jwtTokenGen";
import { envVars } from "../config/env";
import { User } from "../modules/users/user.model";
import statusCode from 'http-status-codes'
import { IsActive } from "../modules/users/user.interface";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.headers.authorization;
            if (!accessToken) {
                throw new AppError(403, "Token not accessable!")
            }

            const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_TOKEN) as JwtPayload
            const isUserExist = await User.findOne({ email: verifiedToken.email })

            if (!isUserExist) {
                throw new AppError(statusCode.BAD_REQUEST, "User Does Not Exist")
            }

            if (isUserExist.isActive === IsActive.INACTIVE || isUserExist.isActive === IsActive.BLOCKED) {
                throw new AppError(statusCode.BAD_REQUEST, `This use is ${isUserExist.isActive}`)
            }

            if (isUserExist.isDeleted) {
                throw new AppError(statusCode.BAD_REQUEST, "This user already deleted!")
            }

            if (!authRoles.includes(verifiedToken.role)) {
                throw new AppError(403, "Unauthorized access!")
            }

            req.user = verifiedToken

            next()
        } catch (error) {
            next(error)
        }
    }