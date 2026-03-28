import { Router } from "express";
import { router as usersRouter } from "./users.router.ts";

export const router = Router();

router.use(usersRouter);