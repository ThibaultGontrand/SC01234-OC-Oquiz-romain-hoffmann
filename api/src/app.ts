import cors from "cors";
import express from "express";
import { router as apiRouter } from "./routers/index.router.ts";
import { config } from "../config.ts";

// Créer une app Express
export const app = express();

// Autoriser les requêtes cross-origin
app.use(cors({ origin: config.allowedOrigins }));

// Body parser pour récupérer les body "application/json" dans req.body
app.use(express.json());

// Brancher le routeur de l'API
app.use("/api", apiRouter);