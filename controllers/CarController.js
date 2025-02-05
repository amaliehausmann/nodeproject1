import express from "express";
import { CarModel } from "../models/CarModel.js";

// Opretter en router
export const carController = express.Router();

//READ: Route til at hente liste
carController.get("/cars", async (req, res) => {
  try {
    //Henter alle biler fra databasen ved at kalde findAll på carModel
    let cars = await CarModel.findAll();

    //Tjekker om listen er tom eller undefined
    if (!cars || cars.length === 0) {
      //Returnerer 404, hvis ingen biler er fundet
      return res.status(404).json({ message: "Ingen biler fundet" });
    }

    //Returnerer listen af biler so JSON
    res.json(cars);
  } catch (error) {
    //Returnerer en HTTP 500 statuskode med en fejlbesked
    res.status(500).send({
      message: `Fejl i kald af CarModel: ${error.message}`,
    });
  }
});

//READ: Route til at hente detaljer
carController.get("/cars/:id([0-9]*)", async (req, res) => {
  try {
    //Konvertere ID til heltal
    const id = parseInt(req.params.id, 10);

    //Finder bilen i databasen baseret på id
    let result = await CarModel.findOne({
      where: { id: id },
    });

    //Hvis bilen ikke findes returneres en 404-fejl
    if (!result) {
      return res.status(404).json({ message: "Bil ikke fundet" });
    }

    //Returnerer bilens data som JSON
    res.json(result);

    //Returnerer en 500-fejl
  } catch (error) {
    res.status(500).json({
      message: `Fejl i kald af CarModel: ${error.message}`,
    });
  }
});

//CREATE: Route til at oprette
carController.post("/cars", async (req, res) => {
  const { brand, year, price, color, model } = req.body;

  if (!brand || !year || !price || !color || !model) {
    return res.status(400).json({ message: "Du skal udfylde alle felter" });
  }

  try {
    const result = await CarModel.create(req.body);

    res.status(201).json(result);
  } catch (error) {
    console.error("Fejl ved oprettelse af bil:", error);

    res
      .status(500)
      .json({ message: `Fejl i oprettelse af CarModel: ${error.message} ` });
  }
});

carController.delete("/cars", async (req, res) => {
    try {
      await CarModel.destroy({ where: {} }); // Deletes all records
  
      res.status(200).json({ message: "All cars have been deleted" });
    } catch (error) {
      console.error("Error deleting cars:", error);
      res.status(500).json({ message: `Error: ${error.message}` });
    }
  });
  

// //UPDATE: Route til at opdatere
// carController.post('/cars/:id([0-9]*)', async (req, res) => {

// })

// //DELETE: Route til at slette
// carController.delete('/cars/:id([0-9]*)', async (req, res) => {

// })
