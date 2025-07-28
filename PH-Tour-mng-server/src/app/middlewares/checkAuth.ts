import { NextFunction, Request, Response } from "express";
import AppError from "../errorHalpers/AppError";
import Jwt, { JwtPayload } from 'jsonwebtoken'
import { verifyToken } from "../utils/jwtTokenGen";
import { envVars } from "../config/env";

export const checkAuth = (...authRoles: string[]) => 
    (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError(403, "Token not accessable!")
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_TOKEN) as JwtPayload

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "Unauthorized access!")
        }

        req.user = verifiedToken

        next()
    } catch (error) {
        next(error)
    }
}