import { Request, Response } from "express";
import statusCode from 'http-status-codes'
import { User } from "./user.model";

const createUser = async (req: Request, res: Response) => {
    try {
        const {name, email, password} = req.body;
        const user = await User.create({name, email, password})
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