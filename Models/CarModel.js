import sequelize from "../config/sequelizeConfig.js";
import { DataTypes, Model } from "sequelize";

export class CarModel extends Model {}

CarModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.00,
    },

    category:{
      type: DataTypes.STRING,
      allowNull: false,
    },

    fueltype: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: "car", //Modellens navn
    underscored: true, //True: car_brand || false: carBrands
    freezeTableName: false, //True: car || false: cars
    createdAt: true, //Tilføjer createdAt felt
    updatedAt: true, //Tilføjer updatedAt felt
  }
);
