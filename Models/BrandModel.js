import sequelize from "../config/sequelizeConfig.js";
import { DataTypes, Model } from "sequelize";

export class BrandModel extends Model{}

BrandModel.init(
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

        logo: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: "brand", //Modellens navn
        underscored: true, //True: brand_name || false: brandName
        freezeTableName: false, //True: brand || false: brands
        createdAt: true, //Tilføjer createdAt felt
        updatedAt: true, //Tilføjer updatedAt felt
      }
)
