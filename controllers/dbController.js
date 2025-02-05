import express from 'express';
import { CarModel } from '../Models/CarModel.js';
import { BrandModel } from '../models/BrandModel.js';
import { CategoryModel } from '../models/CategoryModel.js';
import sequelize from '../config/sequelizeConfig.js';

// Opretter en router
export const dbController = express.Router();

dbController.get("/sync", async (req, res) => {
  try {
    const resp = await sequelize.sync();
    res.send("Data successfully synchronized");
  } catch (err) {
    res.send(err);
  }
});
