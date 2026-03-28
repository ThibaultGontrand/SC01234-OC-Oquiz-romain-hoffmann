import type { Request, Response } from "express";
import { prisma } from "../models/index.ts";

export async function getAllUsers(req: Request, res: Response) {
    // Appel la BDD
    const users = await prisma.user.findMany();
  
    // Réponse au client
    res.json(users);
  }