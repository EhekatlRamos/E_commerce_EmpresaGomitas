import express from 'express';
import { obtenerProducto } from '../controllers/catalogoController';
const router=express.Router();
//Endpoints
router.get('/productos',obtenerProducto);
export default router;