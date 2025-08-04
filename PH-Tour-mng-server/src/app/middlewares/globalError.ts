import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHalpers/AppError";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let errorSource = []
    let statusCode = 500
    let message = "Something went wrong"

    // Duplicate Error
    if (err === 11000) {
        const matchedArray = err.message.match(/"([^"]*)"/)
        statusCode = 400;
        message = `${matchedArray[1]} are already exist!`
    }
    // Object Id / Cast error
    else if (err.name === "CastError") {
        statusCode = 400
        message = "Invalid user Id. Please provide a valid Id"
    }
    // Mongoose Validation Error
    else if (err.name === "ValidationError") {
        statusCode = 400;
        const errors = Object.values(err.errors)
        errors.forEach((errObject: any) => errorSource.push({
            path: errObject.path,
            message: errObject.message
        }))
        message = "Validation Error"
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    } else if (err instanceof Error) {
        statusCode = 500
        message = err.message
    }


    res.status(statusCode).json({
        success: false,
        message,
        err,
        stack: envVars.NODE_ENV === 'development' ? err.stack : null
    })
}