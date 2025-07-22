import { NextFunction, Request, Response } from "express";
import statusCode from 'http-status-codes'
import { UserServices } from "./user.service";
import AppError from "../../errorHalpers/AppError";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
        const user = await UserServices.createUser(req.body);
        res.status(statusCode.CREATED).json({
            success: true,
            message: "User created successfully",
            user
        })
}

const getAllUsers = async (req: Request, res: Response) => {
    const users = await UserServices.getAllUsers()
    res.status(statusCode.OK).json({
        success: true,
        message: "Get all users successfully",
        data: users
    })
}

export const UserControllers = {
    createUser,
    getAllUsers
}