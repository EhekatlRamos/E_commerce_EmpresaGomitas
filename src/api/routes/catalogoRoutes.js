    import express from 'express';
    import { obtenerProducto, crearVentas } from '../controllers/catalogoController.js';
    const router=express.Router();
    //Endpoints
    router.get('/productos',obtenerProducto);
    router.post('/ventas',crearVentas);
    export default router;