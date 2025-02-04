import express from 'express'
import dotenv from 'dotenv'
import sequelize from './Config/sequelizeConfig.js';

dotenv.config();

const app = express();

const port = process.env.SERVERPORT || 4000;

app.get('/', (req, res) => {
    res.send('Hello World');
    console.log('Hello World from the console');
}) 

app.listen(port, () => {
    console.log(`Server runs at http://localhost:${port}`)
});