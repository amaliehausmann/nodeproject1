import sequelize from "../config/sequelizeConfig.js";
import { DataTypes, Model } from "sequelize";

export class CategoryModel extends Model {}

CategoryModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

  {
    sequelize,
    modelName: "category", //Modellens navn
    underscored: true, //True: category_name || false: categoryName
    freezeTableName: false, //True: category || false: categories
    createdAt: true, //Tilføjer createdAt felt
    updatedAt: true, //Tilføjer updatedAt felt
  }
);
