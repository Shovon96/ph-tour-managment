import { TGenericErrorResponse } from "../interface/error.types"

export const handleDuplicateError = (err: any): TGenericErrorResponse => {
    const matchedArray = err.message.match(/"([^"]*)"/)
    return {
        statusCode: 400,
        message: `${matchedArray[1]} are already exist!`
    }
}