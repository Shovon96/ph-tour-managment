import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import statusCode from 'http-status-codes'
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwtTokenGen";
import { envVars } from "../../config/env";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
        statusCode: statusCode.CREATED,
        success: true,
        message: "User Created Successfully",
        data: user,
    })
})

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;

    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_TOKEN) as JwtPayload
    const verifiedToken = req.user
    const user = await UserServices.updateUser(userId, payload, verifiedToken)

    sendResponse(res, {
        statusCode: statusCode.CREATED,
        success: true,
        message: "User Updated Successfully!!",
        data: user,
    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.getAllUsers()
    // console.log(result.meta)

    sendResponse(res, {
        success: true,
        statusCode: statusCode.CREATED,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })
})

export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser
}