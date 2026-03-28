import express from "express";
import { router as apiRouter } from "./routers/index.router.ts";

// Créer une app Express
export const app = express();

// Body parser pour récupérer les body "application/json" dans req.body
app.use(express.json());

// Brancher le routeur de l'API
app.use("/api", apiRouter);