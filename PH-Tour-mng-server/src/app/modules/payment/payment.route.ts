import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router()

router.post('/success', PaymentController.successPayment)

export const PaymentRouters = router;