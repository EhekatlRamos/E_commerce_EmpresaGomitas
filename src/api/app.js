import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import catalogoRoutes from './routes/catalogoRoutes.js';
import path from 'path';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
//Rutas
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));
app.use('/api/catalogo',catalogoRoutes);
//Puerto
const PORT = process.env.PORT||4000;
app.listen(PORT,()=>console.log(`Servidor corriendo en el puerto ${PORT}`));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));