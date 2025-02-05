import express from "express";
import dotenv from "dotenv";
import { dbController } from "./controllers/dbController.js";
import { carController } from "./Controllers/CarController.js";

dotenv.config();

const app = express();
const port = process.env.SERVERPORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
  console.log("Hello World from the console");
});

app.use(dbController);
app.use(carController);

app.listen(port, () => {
  console.log(`Server runs at http://localhost:${port}`);
});

//Route til 404
app.get("*", (req, res) => {
  res.send("Could not find file");
});
