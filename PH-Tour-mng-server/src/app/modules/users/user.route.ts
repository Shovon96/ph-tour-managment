import { Router } from "express";
import { UserControllers } from "./user.controller";

export const router = Router()

router.post('/register', UserControllers.createUser)
router.get('/all-users', UserControllers.getAllUsers)

export const UserRouters = router