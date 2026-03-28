import type { Request, Response } from "express";

export async function getAllUsers(req: Request, res: Response) {
    // Exemple
    const users = [
        {
            id: 1,
            nom: "toto"
        },
        {
            id: 2,
            nom: "tata"
        }
    ];

    // Réponse au client
    res.json(users);
}