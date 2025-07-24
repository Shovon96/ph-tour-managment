import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from 'http-status-codes'

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthService.credentialsLogin(req.body)

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: "User Logged In Successfully",
        data: loginInfo,
    })
})

export const AuthControllers = {
    credentialsLogin
}