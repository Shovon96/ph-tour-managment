import { Request, Response } from "express";
import statusCode from 'http-status-codes'
import { UserServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    try {
        const user = await UserServices.createUser(req.body);
        res.status(statusCode.CREATED).json({
            message: "User created successfully",
            user
        })
    } catch (error) {
        console.log(error)
        res.status(statusCode.BAD_REQUEST).json({
            message: 'Something went wrong create user',
            error
        })
    }
}

export const UserControllers = {
    createUser
}