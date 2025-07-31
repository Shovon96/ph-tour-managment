import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router()

router.use('/login', AuthControllers.credentialsLogin)
router.use('/refresh-token', AuthControllers.getNewAccessToken)
router.use('/logout', AuthControllers.logOut)

export const AuthRoutes = router;