import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import catalogoRoutes from './routes/catalogoRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Configuración para que __dirname funcione en módulos modernos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// 2. ESTA LÍNEA ES VITAL: Hace pública la carpeta de imágenes
// Sin esto, el servidor bloquea el acceso a las fotos subidas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/catalogo', catalogoRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));