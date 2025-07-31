import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from 'http-status-codes'
import AppError from "../../errorHalpers/AppError";
import { setAuthCookie } from "../../utils/setCookies";

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
        message: "User Logged In Successfully",
        data: tokenInfo,
    })
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken
}