import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../users/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourZodSchema, tourTypeZodSchema, updateTourZodSchema } from "./tour.validation";
import { TourController } from "./tour.controller";
import { multerUpload } from "../../config/malta.config";


const router = Router()

// ----------Tour Type Routes--------------
router.post('/create-tour-type',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(tourTypeZodSchema),
    TourController.createTourType
)
router.get('/tour-types', TourController.getAllTourTypes)
router.get('/tour-types/:id', TourController.getSingleTourType)

router.patch('/tour-types/:id',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(tourTypeZodSchema),
    TourController.updateTourTypes
)

router.delete('/tour-types/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourController.deleteTourType)


// -----------Tour Routes-------------
router.post('/create',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.array("files"),
    validateRequest(createTourZodSchema),
    TourController.createTour
)

router.get('/', TourController.getAllTours)
router.get('/:slug', TourController.getSingleTour)

router.patch('/:id',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateTourZodSchema),
    TourController.updateTour
)

router.delete('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourController.deleteTour)


export const TourRoutes = router;