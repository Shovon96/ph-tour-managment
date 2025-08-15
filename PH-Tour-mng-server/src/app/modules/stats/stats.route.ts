import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../users/user.interface";
import { StatsController } from "./stats.controller";

const router = Router()

router.get('/users', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), StatsController.getUserStats)

export const StatsRoute = router