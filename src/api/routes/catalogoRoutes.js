    import express from 'express';
    import { obtenerProducto, crearVentas, iniciarSesion, registrar } from '../controllers/catalogoController.js';
    const router=express.Router();
    //Endpoints
    router.get('/productos',obtenerProducto);
    router.post('/ventas',crearVentas);
    router.post('/iniciar-sesion', iniciarSesion);
    router.post('/registro', registrar);
    export default router;