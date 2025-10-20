import express from 'express';
import { obtenerProducto } from '../controllers/catalogoController.js';
const router=express.Router();
//Endpoints
router.get('/productos',obtenerProducto);
export default router;