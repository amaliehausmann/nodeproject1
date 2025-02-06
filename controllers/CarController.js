import express from "express";
import { CarModel } from "../Models/CarModel.js";
import { BrandModel } from "../models/BrandModel.js";
import { CategoryModel } from "../models/CategoryModel.js";

// Opretter en router
export const carController = express.Router();

//Definerer relationen mellem carModel og BrandModel
CarModel.belongsTo(BrandModel, {
    foreignKey: {
        allowNull: false
    }
})

CarModel.belongsTo(CategoryModel, {
    foreignKey: {
        allowNull: false
    }
})

CategoryModel.hasMany(CarModel);

//READ: Route til at hente liste
carController.get("/cars", async (req, res) => {

  try {
    //Henter alle biler fra databasen ved at kalde findAll på carModel
    let cars = await CarModel.findAll({

        include: [
            {
                model: BrandModel,
                attributes: ['name', 'logo', 'id']
            },
            {
                model: CategoryModel,
                attributes: ['name', 'id']
            }
        ]
    });
    

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
      include: [
        {
            model: BrandModel,
            attributes: ['name', 'logo', 'id']
        },
        {
            model: CategoryModel,
            attributes: ['name', 'id']
        }
    ]
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
  // Udtrækker year, price, fueltype, model, brandId og categoryId fra request body
  const { year, price, fueltype, model, brand_id: brandId, category_id: categoryId } = req.body;

  if (!model || !year || !price || !fueltype || !brandId || !categoryId) {
    return res.status(400).json({ message: "Alle felter skal sendes med" });
  }

  try {
    // Opretter en ny bil i databasen med de angivne oplysninger
    const result = await CarModel.create({
      model,
      year,
      price,
      fueltype,
      brandId,
      categoryId
    });

    // Returnerer den oprettede bil som JSON og status 201 (Created)
    res.status(201).json(result);
  } catch (error) {
    // Logger fejlen i serverens konsol til fejlfinding
    console.error("Fejl ved oprettelse af bil:", error);
    // Returnerer en 500-fejl (Internal Server Error) med en fejlmeddelelse
    res
      .status(500)
      .json({ message: `Fejl i oprettelse af CarModel: ${error.message} ` });
  }
});

//UPDATE: Route til at opdatere
carController.put("/cars/:id([0-9]*)", async (req, res) => {
  // Udtrækker brand, year, price, model, category og fueltype fra request body
  const { year, price, model, fueltype, brand_id: brandId, category_id: categoryId } = req.body;

  const { id } = req.params;

  try { 
    // Opdaterer bilen i databasen baseret på det givne ID
    const result = await CarModel.update(
      {year, price, model, fueltype, brandId, categoryId },
      { where: { id } }
    );

    // Tjekker om en række blev opdateret (result[0] er antal rækker opdateret)
    if (result[0] > 0) {
      res.status(200).json({ message: "Bil opdateret successfuldt" });
    } else {
      res.status(404).json({ message: "Bil ikke fundet" });
    }
  } catch (error) {
    // Logger fejlen og returnerer en 500-serverfejl
    res.status(500).json({
      message: `Fejl ved opdatering af CarModel: ${error.message}`,
    });
  }
});

//DELETE: Route til at slette
carController.delete("/cars/:id([0-9]*)", async (req, res) => {
  //Henter id fra URL-parametrene
  const { id } = req.params;

  if (id) {
    try {
      //Forsøger at slette bilen fra databasen baseret på ID
      await CarModel.destroy({
        where: { id },
      });

      //Returnerer success besked
      res.status(200).send({
        message: "Rækken er slettet",
      });
    } catch (error) {
      //Send en HTTP-statuskode 500 hvis der opstår en fejl
      res.status(500).send({
        message: `Kunne ikke slette bilen: ${error.message}`,
      });
    }
  } else {
    // Sender 400 Bad Request-fejl hvis ID er ugyldigt
    res.status(400).send({
      message: "Id er ugyldigt",
    });
  }
});
