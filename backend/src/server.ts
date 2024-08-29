import "reflect-metadata";
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createConnection } from 'typeorm';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import tmeRoutes from './routes/tme'; 
import * as dotenv from 'dotenv';
 // Importation des routes TME


 // Charger les variables d'environnement depuis le fichier .env
dotenv.config();


console.log("Starting server...");

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(bodyParser.json());

createConnection().then(() => {
  console.log("Database connection established");

  // Routes d'authentification
  app.use('/auth', authRoutes);

  // Routes d'administration
  app.use('/admin', adminRoutes);

  // Routes pour TME
  app.use('/tme', tmeRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error("Error during database connection: ", error);
});
