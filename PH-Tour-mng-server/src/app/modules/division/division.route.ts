import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../users/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { DivisionController } from "./division.controller";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";

const router = Router()

router.post('/create',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createDivisionSchema),
    DivisionController.createDivision
)

router.get('/', DivisionController.getAllDivisions)
router.get('/:slug', DivisionController.getSingleDivision)

router.patch('/:id',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateDivisionSchema),
    DivisionController.updateDivision
)

export const DivisionRoutes = router