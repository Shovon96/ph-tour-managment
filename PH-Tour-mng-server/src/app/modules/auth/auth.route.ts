import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../users/user.interface";

const router = Router()

router.use('/login', AuthControllers.credentialsLogin)
router.use('/refresh-token', AuthControllers.getNewAccessToken)
router.use('/logout', AuthControllers.logOut)
router.use('/reset-password', checkAuth(...Object.values(Role)), AuthControllers.resetPassword)

export const AuthRoutes = router;