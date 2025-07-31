import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router()

router.use('/login', AuthControllers.credentialsLogin)
router.use('/refresh-token', AuthControllers.getNewAccessToken)

export const AuthRoutes = router;