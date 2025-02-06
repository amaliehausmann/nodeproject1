import express from "express";
import { CategoryModel } from "../models/CategoryModel.js";

// Opretter en router
export const categoryController = express.Router();

// READ: Route til at hente liste
categoryController.get("/categories", async (req, res) => {
  try {
    // Henter alle categories fra databasen ved at kalde findAll på CategoryModel
    let categories = await CategoryModel.findAll();

    // Tjekker om listen er tom eller undefined
    if (!categories || categories.length === 0) {
      // Returnerer 404, hvis ingen categories er fundet
      return res.status(404).json({ message: "Ingen categories fundet" });
    }

    // Returnerer listen af categories som JSON
    res.json(categories);
  } catch (error) {
    // Returnerer en HTTP 500 statuskode med en fejlbesked
    res.status(500).send({
      message: `Fejl i kald af CategoryModel: ${error.message}`,
    });
  }
});

// READ: Route til at hente detaljer
categoryController.get("/categories/:id([0-9]*)", async (req, res) => {
  try {
    // Konverterer ID til heltal
    const id = parseInt(req.params.id, 10);

    // Finder category i databasen baseret på id
    let result = await CategoryModel.findOne({
      where: { id: id },
    });

    // Hvis category ikke findes returneres en 404-fejl
    if (!result) {
      return res.status(404).json({ message: "Category ikke fundet" });
    }

    // Returnerer categories data som JSON
    res.json(result);

    // Returnerer en 500-fejl
  } catch (error) {
    res.status(500).json({
      message: `Fejl i kald af CategoryModel: ${error.message}`,
    });
  }
});

// CREATE: Route til at oprette
categoryController.post("/categories", async (req, res) => {
  // Udtrækker name fra request body
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Alle felter skal sendes med" });
  }

  try {
    // Opretter en ny category i databasen med de angivne oplysninger
    const result = await CategoryModel.create({ name });

    // Returnerer den oprettede category som JSON og status 201 (Created)
    res.status(201).json(result);
  } catch (error) {
    // Logger fejlen i serverens konsol til fejlfinding
    console.error("Fejl ved oprettelse af category:", error);
    // Returnerer en 500-fejl (Internal Server Error) med en fejlmeddelelse
    res.status(500).json({
      message: `Fejl i oprettelse af CategoryModel: ${error.message} `,
    });
  }
});

// UPDATE: Route til at opdatere
categoryController.put("/categories/:id([0-9]*)", async (req, res) => {
  // Udtrækker name fra request body
  const { name } = req.body;

  // Udtrækker id fra parametrene
  const { id } = req.params;

  try {
    // Opdaterer category i databasen baseret på det givne ID
    const result = await CategoryModel.update({ name }, { where: { id } });

    // Tjekker om en række blev opdateret (result[0] er antal rækker opdateret)
    if (result[0] > 0) {
      res.status(200).json({ message: "Category opdateret successfuldt" });
    } else {
      res.status(404).json({ message: "Category ikke fundet" });
    }
  } catch (error) {
    // Logger fejlen og returnerer en 500-serverfejl
    res.status(500).json({
      message: `Fejl ved opdatering af CategoryModel: ${error.message}`,
    });
  }
});

// DELETE: Route til at slette
categoryController.delete("/categories/:id([0-9]*)", async (req, res) => {
  // Henter id fra URL-parametrene
  const { id } = req.params;

  try {
    // Forsøger at slette category fra databasen baseret på ID
    await CategoryModel.destroy({
      where: { id },
    });

    // Returnerer success-besked
    res.status(200).send({
      message: "Rækken er slettet",
    });
  } catch (error) {
    // Send en HTTP-statuskode 500 hvis der opstår en fejl
    res.status(500).send({
      message: `Kunne ikke slette category: ${error.message}`,
    });
  }
});
