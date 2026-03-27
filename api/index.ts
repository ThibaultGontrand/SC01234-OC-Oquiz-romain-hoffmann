import { config } from "./config.ts";
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello from the API!" });
});

// Démarre un serveur
app.listen(config.port, () => {
  console.info(`🚀 Server started at http://localhost:${config.port}`);
});
