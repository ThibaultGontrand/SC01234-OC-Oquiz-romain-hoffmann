import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello from the API!" });
});

const port = 3000;
app.listen(port, () => {
  console.log("API is running on http://localhost:3000");
});
