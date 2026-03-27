import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello from the API!" });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.info(`🚀 Server started at http://localhost:${port}`);
});
