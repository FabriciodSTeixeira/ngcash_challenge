import { Router } from "express";
import { checkJwt } from "../middlewares/checkJWT";
import { TransactionController } from "../controllers/TransactionController";


const router = Router();

router.get("/transaction/all-transactions", [checkJwt], TransactionController.getAllTransactions);
router.get("/transaction/cash-out-transactions", [checkJwt], TransactionController.cashOutTransactions);
router.get("/transaction/cash-in-transactions", [checkJwt], TransactionController.cashInTransactions);

export default router;