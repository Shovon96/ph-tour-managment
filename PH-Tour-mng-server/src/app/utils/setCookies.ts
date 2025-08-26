import { Response } from "express"

interface AtuhTokens {
    accessToken?: string,
    refreshToken?: string
}

export const setAuthCookie = (res: Response, tokenInfo: AtuhTokens) => {

    if (tokenInfo.accessToken) {
        res.cookie('accessToken', tokenInfo.accessToken, {
            httpOnly: true,
            secure: true,
            // secure: envVars.NODE_ENV === "production",
            sameSite: "none"
        })
    }
    if (tokenInfo.refreshToken) {
        res.cookie('refreshToken', tokenInfo.refreshToken, {
            httpOnly: true,
            secure: true,
            // secure: envVars.NODE_ENV === "production",
            sameSite: "none"
        })
    }
}