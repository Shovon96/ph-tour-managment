import { TErrorSources, TGenericErrorResponse } from "../interface/error.types"

export const handleZodValidationError = (err: any): TGenericErrorResponse => {

    const errorSources: TErrorSources[] = []

    err.issues.forEach((issue: any) => {
        errorSources.push({
            path: issue.path[issue.path - 1],
            message: issue.message
        })
    })
    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources
    }
}