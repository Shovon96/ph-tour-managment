import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHalpers/AppError";
import { TErrorSources } from "../interface/error.types";
import { handleDuplicateError } from "../helperErrors/duplicateError";
import { handleCastError } from "../helperErrors/castError";
import { handleZodValidationError } from "../helperErrors/zodValidationError";
import { handleMogooseValidationError } from "../helperErrors/mongooseError";
import { deleteImageFromCloudinary } from "../config/cloudinary.config";


export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {

    // When throw error Remove the image path from cloudiry after save
    if (req.file) {
        await deleteImageFromCloudinary(req.file.path)
    }

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const imageUrls = (req.files as Express.Multer.File[]).map(file => file.path)
        await Promise.all(imageUrls.map(url => deleteImageFromCloudinary(url)))
    }

    let errorSources: TErrorSources[] = []
    let statusCode = 500
    let message = "Something went wrong"

    // Duplicate Error
    if (err === 11000) {
        const simplifiedError = handleDuplicateError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
    }
    // Object Id / Cast error
    else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
    }
    // Zod Validation Error
    else if (err.name === "ZodError") {
        const simplifiedError = handleZodValidationError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }
    // Mongoose Validation Error
    else if (err.name === "ValidationError") {
        const simplifiedError = handleMogooseValidationError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources as TErrorSources[]
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
        errorSources,
        err: envVars.NODE_ENV === 'development' ? err : null,
        stack: envVars.NODE_ENV === 'development' ? err.stack : null
    })
}