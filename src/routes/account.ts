import { Router } from "express";
import { checkJwt } from "../middlewares/checkJWT";
import { AccountController } from "../controllers/AccountController";

const router = Router();

router
    .route("/account")
    .put([checkJwt], AccountController.cashOut)
    .get([checkJwt], AccountController.viewBalance)

router.put("/account/transfer", [checkJwt], AccountController.transfer);
router.put("/account/deposit", [checkJwt], AccountController.deposit);

export default router;