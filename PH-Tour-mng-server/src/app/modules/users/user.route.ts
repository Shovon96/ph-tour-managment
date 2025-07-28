import Jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuth";

export const router = Router()

router.post('/register', validateRequest(createUserZodSchema), UserControllers.createUser)

router.get('/all-users', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers)

router.patch('/:id', checkAuth(...Object.values(Role)), UserControllers.updateUser)

export const UserRouters = router