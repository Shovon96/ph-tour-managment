import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../users/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";

const router = Router()

router.post('/login', AuthControllers.credentialsLogin)
router.post('/refresh-token', AuthControllers.getNewAccessToken)
router.post('/logout', AuthControllers.logOut)
router.post('/set-password', checkAuth(...Object.values(Role)), AuthControllers.setPassword)
router.post('/chage-password', checkAuth(...Object.values(Role)), AuthControllers.changePassword)
router.post('/reset-password', checkAuth(...Object.values(Role)), AuthControllers.resetPassword)
router.post('/forgot-password', AuthControllers.forgotPassword)

router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})

router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${envVars.FRONTEND_URL}/login?error=something went wrong! please contact with support team` }), AuthControllers.googleCallback)



export const AuthRoutes = router;