import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import catalogoRoutes from './routes/catalogoRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CORRECCIÓN: Definir __dirname manualmente para ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// --- CORRECCIÓN: Ruta estática para las imágenes ---
// Asegúrate de que la carpeta se llame 'uploads' y esté junto a app.js
// Si creaste la carpeta dentro de 'public', usa 'public/uploads' en lugar de 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

// Rutas
app.use('/api/catalogo', catalogoRoutes);

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));