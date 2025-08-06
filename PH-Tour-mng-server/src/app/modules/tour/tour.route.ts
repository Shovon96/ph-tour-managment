import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../users/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourZodSchema, tourTypeZodSchema } from "./tour.validation";
import { TourController } from "./tour.controller";


const router = Router()

// ----------Tour Type Routes--------------
router.post('/create-tour-type',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(tourTypeZodSchema),
    TourController.createTourType
)
router.get('/tour-types', TourController.getAllTourTypes)

router.patch('/tour-types/:id',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(tourTypeZodSchema),
    TourController.updateTourTypes
)

router.delete('/tour-types/:id', TourController.deleteTourType)


// -----------Tour Routes-------------
router.post('/create',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourZodSchema),
    TourController.createTour
)




export const TourRoutes = router;