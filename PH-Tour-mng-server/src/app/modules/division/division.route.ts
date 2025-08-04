import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../users/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { DivisionController } from "./division.controller";
import { createDivisionSchema } from "./division.validation";

const router = Router()

router.post('/create',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createDivisionSchema),
    DivisionController.createDivision
)

router.get('/', DivisionController.getAllDivisions)

export const DivisionRoutes = router