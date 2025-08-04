import mongoose from "mongoose"
import { TErrorSources, TGenericErrorResponse } from "../interface/error.types"

export const handleMogooseValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {

    const errorSources: TErrorSources[] = []
    const errors = Object.values(err.errors)
    errors.forEach((errObject: any) => errorSources.push({
        path: errObject.path,
        message: errObject.message
    }))
    return {
        statusCode: 400,
        message: "Validation Error",
        errorSources
    }
}