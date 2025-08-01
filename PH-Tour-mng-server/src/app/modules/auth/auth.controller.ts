import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from 'http-status-codes'
import AppError from "../../errorHalpers/AppError";
import { setAuthCookie } from "../../utils/setCookies";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utils/userTokens";
import { envVars } from "../../config/env";

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthService.credentialsLogin(req.body)

    setAuthCookie(res, loginInfo)

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: "User Logged In Successfully",
        data: loginInfo,
    })
})

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        throw new AppError(statusCode.BAD_REQUEST, 'No refresh token recive from cookies!')
    }
    const tokenInfo = await AuthService.getNewAccessToken(refreshToken as string);

    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: "New Cookie Retrive Successfully",
        data: tokenInfo,
    })
})

const logOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: "User Logout Successfully!",
        data: null,
    })
})

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;

    await AuthService.resetPassword(newPassword, oldPassword, decodedToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: "Password Reset Successfully!",
        data: null,
    })
})

const googleCallback = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : ""
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }

    const user = req.user;
    if (!user) {
        throw new AppError(statusCode.NOT_FOUND, "User Not Found")
    }

    const tokenInfo = createUserTokens(user)
    setAuthCookie(res, tokenInfo)

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logOut,
    resetPassword,
    googleCallback
}