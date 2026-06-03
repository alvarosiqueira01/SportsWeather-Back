import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import { loginSchema, registerSchema } from "../schemas/auth.schema"; 

const router = Router();

router.post("/login", validate(loginSchema), login);

router.post("/register", validate(registerSchema), register);

export default router;