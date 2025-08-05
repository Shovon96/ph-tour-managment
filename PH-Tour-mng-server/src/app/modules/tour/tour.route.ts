import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../users/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourTypeZodSchema } from "./tour.validation";
import { TourController } from "./tour.controller";


const router = Router()

// ----------Tour Type Routes
router.post('/create-tour-type',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    TourController.createTourType
)
router.get('/tour-types', TourController.getAllTourTypes)

export const TourRoutes = router;