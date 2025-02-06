import express from "express";
import { BrandModel } from "../models/BrandModel.js";

// Opretter en router
export const brandController = express.Router();

// READ: Route til at hente liste
brandController.get("/brands", async (req, res) => {
  try {
    // Henter alle brands fra databasen ved at kalde findAll på BrandModel
    let brands = await BrandModel.findAll();

    // Tjekker om listen er tom eller undefined
    if (!brands || brands.length === 0) {
      // Returnerer 404, hvis ingen brands er fundet
      return res.status(404).json({ message: "Ingen brands fundet" });
    }

    // Returnerer listen af brands som JSON
    res.json(brands);
  } catch (error) {
    // Returnerer en HTTP 500 statuskode med en fejlbesked
    res.status(500).send({
      message: `Fejl i kald af BrandModel: ${error.message}`,
    });
  }
});

// READ: Route til at hente detaljer
brandController.get("/brands/:id([0-9]*)", async (req, res) => {
  try {
    // Konverterer ID til heltal
    const id = parseInt(req.params.id, 10);

    // Finder brandet i databasen baseret på id
    let result = await BrandModel.findOne({
      where: { id: id },
    });

    // Hvis brandet ikke findes returneres en 404-fejl
    if (!result) {
      return res.status(404).json({ message: "Brand ikke fundet" });
    }

    // Returnerer brandets data som JSON
    res.json(result);

    // Returnerer en 500-fejl
  } catch (error) {
    res.status(500).json({
      message: `Fejl i kald af BrandModel: ${error.message}`,
    });
  }
});

// CREATE: Route til at oprette
brandController.post("/brands", async (req, res) => {
  // Udtrækker name og logo fra request body
  const { name, logo } = req.body;

  if (!name || !logo) {
    return res.status(400).json({ message: "Alle felter skal sendes med" });
  }

  try {
    // Opretter et nyt brand i databasen med de angivne oplysninger
    const result = await BrandModel.create({ name, logo });

    // Returnerer det oprettede brand som JSON og status 201 (Created)
    res.status(201).json(result);
  } catch (error) {
    // Logger fejlen i serverens konsol til fejlfinding
    console.error("Fejl ved oprettelse af brand:", error);
    // Returnerer en 500-fejl (Internal Server Error) med en fejlmeddelelse
    res.status(500).json({
      message: `Fejl i oprettelse af BrandModel: ${error.message} `,
    });
  }
});

// UPDATE: Route til at opdatere
brandController.put("/brands/:id([0-9]*)", async (req, res) => {
  // Udtrækker name og logo fra request body
  const { name, logo } = req.body;

  // Udtrækker id fra parametrene
  const { id } = req.params;

  try {
    // Opdaterer brandet i databasen baseret på det givne ID
    const result = await BrandModel.update({ name, logo }, { where: { id } });

    // Tjekker om en række blev opdateret (result[0] er antal rækker opdateret)
    if (result[0] > 0) {
      res.status(200).json({ message: "Brand opdateret successfuldt" });
    } else {
      res.status(404).json({ message: "Brand ikke fundet" });
    }
  } catch (error) {
    // Logger fejlen og returnerer en 500-serverfejl
    res.status(500).json({
      message: `Fejl ved opdatering af Brandmodel: ${error.message}`,
    });
  }
});

// DELETE: Route til at slette
brandController.delete("/brands/:id([0-9]*)", async (req, res) => {
  // Henter id fra URL-parametrene
  const { id } = req.params;

  try {
    // Forsøger at slette brandet fra databasen baseret på ID
    await BrandModel.destroy({
      where: { id },
    });

    // Returnerer success-besked
    res.status(200).send({
      message: "Rækken er slettet",
    });
  } catch (error) {
    // Send en HTTP-statuskode 500 hvis der opstår en fejl
    res.status(500).send({
      message: `Kunne ikke slette brandet: ${error.message}`,
    });
  }
});
