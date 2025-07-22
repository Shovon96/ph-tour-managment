import { NextFunction, Request, Response } from "express";
import statusCode from 'http-status-codes'
import { UserServices } from "./user.service";
import AppError from "../../errorHalpers/AppError";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserServices.createUser(req.body);
        res.status(statusCode.CREATED).json({
            message: "User created successfully",
            user
        })
    } catch (error) {
        next(error)
    }
}

export const UserControllers = {
    createUser
}